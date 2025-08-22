import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';

// Mock cart data for development
let mockCart: Cart = {
  id: 'cart-1',
  items: [],
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  currency: 'JOD',
  updatedAt: new Date().toISOString(),
};

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]): Pick<Cart, 'itemCount' | 'subtotal' | 'tax' | 'shipping' | 'total'> => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16; // 16% tax
  const shipping = subtotal > 50 ? 0 : 5; // Free shipping over 50 JOD
  const total = subtotal + tax + shipping;

  return {
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

// Helper function to get product data (mock)
const getProductData = async (productId: string): Promise<{ title: string; titleAr: string; price: number; imageUrl: string }> => {
  // In a real app, this would fetch from your products API
  return {
    title: `Product ${productId}`,
    titleAr: `منتج ${productId}`,
    price: 25.99,
    imageUrl: '/product-holder.webp',
  };
};

export class CartService {
  // Get current cart
  async getCart(): Promise<Cart> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...mockCart };
  }

  // Add item to cart
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const productData = await getProductData(request.productId);
    
    // Check if item already exists
    const existingItemIndex = mockCart.items.findIndex(
      item => item.productId === request.productId && item.variantId === request.variantId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      mockCart.items[existingItemIndex].quantity += request.quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        productId: request.productId,
        variantId: request.variantId,
        quantity: request.quantity,
        price: productData.price || 0,
        image: productData.imageUrl || '/product-holder.webp',
        title: productData.title || `Product ${request.productId}`,
        titleAr: productData.titleAr,
      };
      mockCart.items.push(newItem);
    }

    // Recalculate totals
    const totals = calculateCartTotals(mockCart.items);
    mockCart = {
      ...mockCart,
      ...totals,
      updatedAt: new Date().toISOString(),
    };

    return { ...mockCart };
  }

  // Update cart item quantity
  async updateCartItem(request: UpdateCartItemRequest): Promise<Cart> {
    await new Promise(resolve => setTimeout(resolve, 150));

    const itemIndex = mockCart.items.findIndex(item => item.id === request.itemId);
    
    if (itemIndex === -1) {
      throw new Error('Cart item not found');
    }

    if (request.quantity <= 0) {
      // Remove item if quantity is 0 or less
      mockCart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      mockCart.items[itemIndex].quantity = request.quantity;
    }

    // Recalculate totals
    const totals = calculateCartTotals(mockCart.items);
    mockCart = {
      ...mockCart,
      ...totals,
      updatedAt: new Date().toISOString(),
    };

    return { ...mockCart };
  }

  // Remove item from cart
  async removeCartItem(itemId: string): Promise<Cart> {
    await new Promise(resolve => setTimeout(resolve, 100));

    mockCart.items = mockCart.items.filter(item => item.id !== itemId);

    // Recalculate totals
    const totals = calculateCartTotals(mockCart.items);
    mockCart = {
      ...mockCart,
      ...totals,
      updatedAt: new Date().toISOString(),
    };

    return { ...mockCart };
  }

  // Clear cart
  async clearCart(): Promise<Cart> {
    await new Promise(resolve => setTimeout(resolve, 100));

    mockCart = {
      ...mockCart,
      items: [],
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    };

    return { ...mockCart };
  }
}

export const cartService = new CartService();
