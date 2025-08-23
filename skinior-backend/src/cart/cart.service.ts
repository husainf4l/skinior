import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

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
  sessionId?: string;
  type: 'user' | 'session';
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

  async createCart(userId?: string, sessionId?: string): Promise<Cart> {
    // Priority: User ID > Session ID > Generate new session
    const identifier = userId || sessionId || this.generateSessionId();
    const type = userId ? 'user' : 'session';

    const cart = await this.prisma.cart.create({
      data: {
        customerId: userId || null,
        sessionId: sessionId || identifier,
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

  async getCart(cartId: string, userId?: string, sessionId?: string): Promise<Cart> {
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

    // Verify ownership: cart belongs to current user OR session
    const isOwner = (cart.customerId && cart.customerId === userId) ||
                    (cart.sessionId && cart.sessionId === sessionId) ||
                    (!userId && !sessionId); // Allow access if no authentication context

    if (!isOwner) {
      throw new ForbiddenException('Cart access denied');
    }

    return this.transformCart(cart);
  }

  async findCartByUserOrSession(userId?: string, sessionId?: string): Promise<Cart | null> {
    // First try to find user cart if userId provided
    if (userId) {
      const cartData = await this.prisma.cart.findFirst({
        where: { customerId: userId },
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
        orderBy: { updatedAt: 'desc' },
      });

      if (cartData) {
        return this.transformCart(cartData);
      }
    }

    // If no user cart found and sessionId provided, try session cart
    if (sessionId) {
      const cartData = await this.prisma.cart.findFirst({
        where: { 
          sessionId: sessionId,
          customerId: null, // Only session carts, not migrated ones
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
        orderBy: { updatedAt: 'desc' },
      });

      if (cartData) {
        return this.transformCart(cartData);
      }
    }

    return null;
  }

  async migrateSessionCartToUser(sessionId: string, userId: string): Promise<Cart | null> {
    // Find session cart
    const sessionCart = await this.prisma.cart.findFirst({
      where: { 
        sessionId: sessionId,
        customerId: null, // Only unmigrated session carts
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

    if (sessionCart) {
      // Check if user already has a cart
      const userCart = await this.prisma.cart.findFirst({
        where: { customerId: userId },
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

      if (userCart) {
        // Merge session cart items into user cart
        await this.mergeCartItems(sessionCart, userCart);
        await this.prisma.cart.delete({ where: { id: sessionCart.id } });
        return this.transformCart(userCart);
      } else {
        // Convert session cart to user cart
        const updatedCart = await this.prisma.cart.update({
          where: { id: sessionCart.id },
          data: {
            customerId: userId,
            updatedAt: new Date(),
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
        return this.transformCart(updatedCart);
      }
    }

    return null;
  }

  private async mergeCartItems(sourceCart: any, targetCart: any): Promise<void> {
    for (const sourceItem of sourceCart.items) {
      // Check if item already exists in target cart
      const existingItem = await this.prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: targetCart.id,
            productId: sourceItem.productId,
          },
        },
      });

      if (existingItem) {
        // Update quantity
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + sourceItem.quantity,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new item in target cart
        await this.prisma.cartItem.create({
          data: {
            cartId: targetCart.id,
            productId: sourceItem.productId,
            quantity: sourceItem.quantity,
            unitPrice: sourceItem.unitPrice,
          },
        });
      }
    }

    // Update target cart timestamp
    await this.prisma.cart.update({
      where: { id: targetCart.id },
      data: { updatedAt: new Date() },
    });
  }

  private generateSessionId(): string {
    return randomUUID();
  }

  async addItemToCart(cartId: string, productId: string, quantity: number, userId?: string, sessionId?: string): Promise<Cart> {
    // Check if cart exists and verify ownership
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Verify ownership
    const isOwner = (cart.customerId && cart.customerId === userId) ||
                    (cart.sessionId && cart.sessionId === sessionId) ||
                    (!userId && !sessionId);

    if (!isOwner) {
      throw new ForbiddenException('Cart access denied');
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

    return this.getCart(cartId, userId, sessionId);
  }

  async updateCartItem(cartId: string, itemId: string, quantity: number, userId?: string, sessionId?: string): Promise<Cart> {
    if (quantity <= 0) {
      return this.removeCartItem(cartId, itemId, userId, sessionId);
    }

    // Verify cart ownership
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const isOwner = (cart.customerId && cart.customerId === userId) ||
                    (cart.sessionId && cart.sessionId === sessionId) ||
                    (!userId && !sessionId);

    if (!isOwner) {
      throw new ForbiddenException('Cart access denied');
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

    return this.getCart(cartId, userId, sessionId);
  }

  async removeCartItem(cartId: string, itemId: string, userId?: string, sessionId?: string): Promise<Cart> {
    // Verify cart ownership
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const isOwner = (cart.customerId && cart.customerId === userId) ||
                    (cart.sessionId && cart.sessionId === sessionId) ||
                    (!userId && !sessionId);

    if (!isOwner) {
      throw new ForbiddenException('Cart access denied');
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

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    // Update cart timestamp
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });

    return this.getCart(cartId, userId, sessionId);
  }

  async clearCart(cartId: string, userId?: string, sessionId?: string): Promise<void> {
    // Verify cart ownership
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const isOwner = (cart.customerId && cart.customerId === userId) ||
                    (cart.sessionId && cart.sessionId === sessionId) ||
                    (!userId && !sessionId);

    if (!isOwner) {
      throw new ForbiddenException('Cart access denied');
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
      sessionId: cart.sessionId,
      type: cart.customerId ? 'user' : 'session',
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
