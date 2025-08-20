import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    title: string;
    images: Array<{ url: string; altText?: string }>;
  };
}

export interface Cart {
  id: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  discountCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async createCart(customerId?: string): Promise<Cart> {
    const cart = await this.prisma.cart.create({
      data: {
        customerId,
        currency: 'USD',
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    return this.transformCart(cart);
  }

  async getCart(cartId: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.transformCart(cart);
  }

  async addItemToCart(cartId: string, productId: string, quantity: number): Promise<Cart> {
    // Check if cart exists
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Get product details
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or not available');
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity,
          unitPrice: product.price,
        },
      });
    }

    // Update cart timestamp
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });

    return this.getCart(cartId);
  }

  async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    if (quantity <= 0) {
      return this.removeCartItem(cartId, itemId);
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        updatedAt: new Date(),
      },
    });

    // Update cart timestamp
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });

    return this.getCart(cartId);
  }

  async removeCartItem(cartId: string, itemId: string): Promise<Cart> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    // Update cart timestamp
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });

    return this.getCart(cartId);
  }

  async clearCart(cartId: string): Promise<void> {
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });
  }

  private transformCart(cart: any): Cart {
    const items: CartItem[] = cart.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      product: {
        title: item.product.title,
        images: item.product.images || [],
      },
    }));

    const { subtotal, tax, total } = this.calculateCartTotals(items);

    return {
      id: cart.id,
      customerId: cart.customerId,
      items,
      subtotal,
      tax,
      shipping: 0, // Shipping calculated separately in checkout
      total,
      currency: cart.currency,
      discountCode: cart.discountCode,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  private calculateCartTotals(items: CartItem[]): { subtotal: number; tax: number; total: number } {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax, rounded to 2 decimals
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }
}
