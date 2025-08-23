import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';

// Custom error classes for better error handling
export class CartServiceError extends Error {
  constructor(message: string, public code: string, public details?: unknown) {
    super(message);
    this.name = 'CartServiceError';
  }
}

export class ValidationError extends CartServiceError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ItemNotFoundError extends CartServiceError {
  constructor(itemId: string) {
    super(`Cart item with ID ${itemId} not found`, 'ITEM_NOT_FOUND', { itemId });
    this.name = 'ItemNotFoundError';
  }
}

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

// Configuration constants
const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;
const FREE_SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.16;
const SHIPPING_COST = 5;

// Helper function to calculate cart totals with validation
const calculateCartTotals = (items: CartItem[]): Pick<Cart, 'itemCount' | 'subtotal' | 'tax' | 'shipping' | 'total'> => {
  if (!Array.isArray(items)) {
    throw new ValidationError('Items must be an array');
  }

  const itemCount = items.reduce((sum, item) => {
    if (typeof item.quantity !== 'number' || item.quantity < 0) {
      throw new ValidationError(`Invalid quantity for item ${item.id}`);
    }
    return sum + item.quantity;
  }, 0);

  const subtotal = items.reduce((sum, item) => {
    if (typeof item.price !== 'number' || item.price < 0) {
      throw new ValidationError(`Invalid price for item ${item.id}`);
    }
    return sum + (item.price * item.quantity);
  }, 0);

  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
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
  if (!productId || typeof productId !== 'string') {
    throw new ValidationError('Product ID is required and must be a string');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));

  // In a real app, this would fetch from your products API
  // For now, return mock data
  return {
    title: `Product ${productId}`,
    titleAr: `منتج ${productId}`,
    price: 25.99,
    imageUrl: '/product-holder.webp',
  };
};

// Validation functions
const validateAddToCartRequest = (request: AddToCartRequest): void => {
  if (!request.productId || typeof request.productId !== 'string') {
    throw new ValidationError('Product ID is required and must be a string');
  }

  if (typeof request.quantity !== 'number' || request.quantity < MIN_QUANTITY || request.quantity > MAX_QUANTITY) {
    throw new ValidationError(`Quantity must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}`);
  }

  if (request.variantId && typeof request.variantId !== 'string') {
    throw new ValidationError('Variant ID must be a string if provided');
  }
};

const validateUpdateRequest = (request: UpdateCartItemRequest): void => {
  if (!request.itemId || typeof request.itemId !== 'string') {
    throw new ValidationError('Item ID is required and must be a string');
  }

  if (typeof request.quantity !== 'number' || request.quantity < 0 || request.quantity > MAX_QUANTITY) {
    throw new ValidationError(`Quantity must be between 0 and ${MAX_QUANTITY}`);
  }
};

export class CartService {
  // Get current cart
  async getCart(): Promise<Cart> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return { ...mockCart };
    } catch (error) {
      throw new CartServiceError('Failed to get cart', 'GET_CART_ERROR', error);
    }
  }

  // Add item to cart
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    try {
      // Validate request
      validateAddToCartRequest(request);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const productData = await getProductData(request.productId);
      
      // Check if item already exists
      const existingItemIndex = mockCart.items.findIndex(
        item => item.productId === request.productId && item.variantId === request.variantId
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newQuantity = mockCart.items[existingItemIndex].quantity + request.quantity;
        if (newQuantity > MAX_QUANTITY) {
          throw new ValidationError(`Total quantity cannot exceed ${MAX_QUANTITY}`);
        }
        mockCart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    } catch (error) {
      if (error instanceof CartServiceError) {
        throw error;
      }
      throw new CartServiceError('Failed to add item to cart', 'ADD_TO_CART_ERROR', error);
    }
  }

  // Update cart item quantity
  async updateCartItem(request: UpdateCartItemRequest): Promise<Cart> {
    try {
      // Validate request
      validateUpdateRequest(request);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 150));

      const itemIndex = mockCart.items.findIndex(item => item.id === request.itemId);
      
      if (itemIndex === -1) {
        throw new ItemNotFoundError(request.itemId);
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
    } catch (error) {
      if (error instanceof CartServiceError) {
        throw error;
      }
      throw new CartServiceError('Failed to update cart item', 'UPDATE_ITEM_ERROR', error);
    }
  }

  // Remove item from cart
  async removeCartItem(itemId: string): Promise<Cart> {
    try {
      if (!itemId || typeof itemId !== 'string') {
        throw new ValidationError('Item ID is required and must be a string');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));

      const initialLength = mockCart.items.length;
      mockCart.items = mockCart.items.filter(item => item.id !== itemId);

      if (mockCart.items.length === initialLength) {
        throw new ItemNotFoundError(itemId);
      }

      // Recalculate totals
      const totals = calculateCartTotals(mockCart.items);
      mockCart = {
        ...mockCart,
        ...totals,
        updatedAt: new Date().toISOString(),
      };

      return { ...mockCart };
    } catch (error) {
      if (error instanceof CartServiceError) {
        throw error;
      }
      throw new CartServiceError('Failed to remove cart item', 'REMOVE_ITEM_ERROR', error);
    }
  }

  // Clear cart
  async clearCart(): Promise<Cart> {
    try {
      // Simulate API delay
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
    } catch (error) {
      throw new CartServiceError('Failed to clear cart', 'CLEAR_CART_ERROR', error);
    }
  }

  // Utility method to check if cart is empty
  isCartEmpty(cart: Cart): boolean {
    return !cart || !cart.items || cart.items.length === 0;
  }

  // Utility method to get item by ID
  getItemById(cart: Cart, itemId: string): CartItem | undefined {
    return cart.items.find(item => item.id === itemId);
  }

  // Utility method to validate cart structure
  validateCart(cart: Cart): boolean {
    try {
      if (!cart || typeof cart !== 'object') return false;
      if (!Array.isArray(cart.items)) return false;
      if (typeof cart.itemCount !== 'number' || cart.itemCount < 0) return false;
      if (typeof cart.subtotal !== 'number' || cart.subtotal < 0) return false;
      if (typeof cart.total !== 'number' || cart.total < 0) return false;
      return true;
    } catch {
      return false;
    }
  }
}

export const cartService = new CartService();
