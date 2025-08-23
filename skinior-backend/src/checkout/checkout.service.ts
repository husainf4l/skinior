import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckoutService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    const key = process.env.STRIPE_SECRET_KEY || '';
    if (!key) {
      // Stripe key might be provided later — we'll still construct Stripe with empty key, but operations will fail until provided.
    }
    this.stripe = new Stripe(key, { apiVersion: '2022-11-15' });
  }

  async getShippingOptions(shippingAddress: any) {
    // Simple stub implementation — real implementation should integrate with shipping provider
    return {
      data: {
        shippingOptions: [
          {
            id: 'standard',
            name: 'Standard Shipping',
            description: '5-7 business days',
            price: 500,
            currency: 'USD',
          },
          {
            id: 'express',
            name: 'Express Shipping',
            description: '2-3 business days',
            price: 1500,
            currency: 'USD',
          },
        ],
      },
    };
  }

  async getAvailablePaymentMethods(country: string) {
    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Pay securely with your credit or debit card',
        fees: 'No additional fees',
        supported: true,
      },
    ];

    // Add Cash on Delivery for Jordan
    const countryLower = country.toLowerCase();
    if (countryLower === 'jo' || countryLower === 'jordan') {
      paymentMethods.push({
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        fees: 'Additional 2 JOD handling fee',
        supported: true,
      });
    }

    return {
      data: {
        country,
        paymentMethods,
      },
    };
  }

  async applyDiscount(cartTotal: number, discountCode: string) {
    if (!discountCode) {
      return { data: { discountAmount: 0, newTotal: cartTotal } };
    }

    // Find discount code in database
    const discount = await this.prisma.discountCode.findUnique({
      where: { code: discountCode.toUpperCase() },
    });

    if (!discount || !discount.active) {
      throw new BadRequestException('Invalid or expired discount code');
    }

    // Check if discount is within valid date range
    const now = new Date();
    if (discount.startsAt && now < discount.startsAt) {
      throw new BadRequestException('Discount code is not yet active');
    }
    if (discount.endsAt && now > discount.endsAt) {
      throw new BadRequestException('Discount code has expired');
    }

    // Check minimum amount
    if (cartTotal < discount.minimumAmount) {
      throw new BadRequestException(`Minimum order amount of $${discount.minimumAmount} required`);
    }

    // Check usage limit
    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
      throw new BadRequestException('Discount code has reached its usage limit');
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = Math.round((cartTotal * discount.value) / 100);
    } else if (discount.type === 'fixed') {
      discountAmount = Math.min(discount.value, cartTotal); // Don't exceed cart total
    }

    const newTotal = Math.max(0, cartTotal - discountAmount);

    return {
      data: {
        discountCode: discount.code,
        discountType: discount.type,
        discountValue: discount.value,
        discountAmount,
        newTotal,
      },
    };
  }

  private generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `SKN-${year}-${rand}`;
  }

  async createOrder(payload: any) {
    const { customer, shippingAddress, billingAddress, items, shippingMethod, currency, paymentMethod } = payload;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Order must include at least one item');
    }

    // Validate shipping address for Jordan if COD
    const shippingCountry = shippingAddress?.country?.toLowerCase();
    if (paymentMethod === 'cod' && 
        shippingCountry !== 'jo' && 
        shippingCountry !== 'jordan') {
      throw new BadRequestException('Cash on Delivery is only available for orders within Jordan');
    }

    // Fetch product details for items that don't have complete information
    const enrichedItems = await Promise.all(
      items.map(async (item: any) => {
        if (!item.title || !item.price) {
          // Fetch product details from database
          const product = await this.prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new BadRequestException(`Product not found: ${item.productId}`);
          }

          return {
            ...item,
            title: item.title || product.title,
            price: item.price || product.price,
            sku: item.sku || product.sku,
          };
        }
        return item;
      }),
    );

    // Calculate subtotal and totals
    const subtotal = enrichedItems.reduce((s: number, it: any) => s + (Number(it.price || it.unitPrice || 0) * Number(it.quantity || 1)), 0);

    // For demo purposes, tax = 8% and shipping based on shippingMethod
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    let shipping = 0;
    if (shippingMethod === 'express') shipping = 15.0;
    else shipping = 5.0;

    // COD orders may have additional handling fee
    if (paymentMethod === 'cod') {
      shipping += 2.0; // COD handling fee
    }

    const total = parseFloat((subtotal + tax + shipping).toFixed(2));

    // Handle guest checkout with automatic account creation
    let userId: string | null = null;
    if (customer?.email) {
      try {
        // Check if user already exists
        let existingUser = await this.prisma.user.findUnique({
          where: { email: customer.email.toLowerCase() },
        });

        if (!existingUser) {
          // Create a new user account for guest checkout
          const newUser = await this.prisma.user.create({
            data: {
              email: customer.email.toLowerCase(),
              firstName: customer.firstName || null,
              lastName: customer.lastName || null,
              phone: customer.phone || null,
              role: 'customer',
              isActive: true,
              password: null, // Guest users don't have passwords initially
            },
          });
          userId = newUser.id;
        } else {
          userId = existingUser.id;
          
          // Update user info if it was missing
          if (!existingUser.firstName && customer.firstName) {
            await this.prisma.user.update({
              where: { id: existingUser.id },
              data: {
                firstName: customer.firstName,
                lastName: customer.lastName || existingUser.lastName,
                phone: customer.phone || existingUser.phone,
              },
            });
          }
        }
      } catch (e) {
        // If user creation fails, continue as guest order
        console.warn('Failed to create/update user account:', e);
      }
    }

    // Persist order
    const orderNumber = this.generateOrderNumber();

    try {
      const order = await this.prisma.order.create({
        data: {
          orderNumber,
          userId: userId,
          customerEmail: customer?.email || null,
          customerName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || null,
          status: 'pending',
          paymentMethod: paymentMethod || 'stripe',
          paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'pending',
          subtotal: subtotal,
          tax: tax,
          shipping: shipping,
          total: total,
          currency: currency || 'JOD',
          shippingAddress: JSON.stringify(shippingAddress || {}),
        },
      });

      // Create order items using enriched data
      const orderItemsData = enrichedItems.map((it: any) => ({
        orderId: order.id,
        productId: it.productId || null,
        title: it.title || it.name || 'Unknown product',
        sku: it.sku || null,
        price: Number(it.price || it.unitPrice || 0),
        quantity: Number(it.quantity || 1),
        total: Number((Number(it.price || it.unitPrice || 0) * Number(it.quantity || 1)).toFixed(2)),
      }));

      for (const data of orderItemsData) {
        await this.prisma.orderItem.create({ data });
      }

      return { 
        data: {
          ...order,
          accountCreated: userId && !await this.prisma.user.findFirst({
            where: { 
              id: userId,
              createdAt: { lt: new Date(Date.now() - 60000) } // Created more than 1 minute ago
            }
          }),
        }
      };
    } catch (e) {
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async processPayment(orderId: string, paymentMethodId: string, savePaymentMethod = false, paymentType: 'stripe' | 'cod' = 'stripe') {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Handle Cash on Delivery
    if (paymentType === 'cod' || order.paymentMethod === 'cod') {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'confirmed',
          paymentStatus: 'cod_pending',
          updatedAt: new Date(),
        },
      });

      return {
        data: {
          paymentType: 'cod',
          status: 'confirmed',
          message: 'Order confirmed. Payment will be collected on delivery.',
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      };
    }

    // Handle Stripe payment
    if (!paymentMethodId) {
      throw new BadRequestException('paymentMethodId is required for Stripe payments');
    }

    const amount = Math.round(Number(order.total) * 100); // convert to cents
    const currency = (order.currency || 'JOD').toLowerCase();

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: currency === 'jod' ? 'usd' : currency, // Stripe doesn't support JOD, use USD
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      // Update order with Stripe payment intent ID
      if (paymentIntent.status === 'succeeded') {
        await this.prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'confirmed',
            paymentStatus: 'paid',
            stripePaymentIntentId: paymentIntent.id,
            updatedAt: new Date(),
          },
        });
      }

      return {
        data: {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          status: paymentIntent.status,
          paymentType: 'stripe',
        },
      };
    } catch (e: any) {
      // Update order payment status to failed
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'failed',
          updatedAt: new Date(),
        },
      });

      // Propagate Stripe errors sensibly
      throw new BadRequestException(e.message || 'Payment processing failed');
    }
  }

  async linkGuestAccountWithPassword(email: string, password: string) {
    // Find user account that was created for guest checkout
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new BadRequestException('No account found with this email address');
    }

    if (user.password) {
      throw new BadRequestException('This account already has a password set');
    }

    // Hash password (you'll need to implement password hashing)
    // For now, storing as plain text - in production, use bcrypt or similar
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: password, // Should be hashed in production
      },
    });

    return {
      data: {
        message: 'Password successfully set for your account',
        email: user.email,
      },
    };
  }

  async getOrderHistory(email: string) {
    // Get all orders for a customer by email
    const orders = await this.prisma.order.findMany({
      where: { customerEmail: email.toLowerCase() },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: {
        orders,
        totalOrders: orders.length,
      },
    };
  }
}
