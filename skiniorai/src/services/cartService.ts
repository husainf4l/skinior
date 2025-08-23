import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';
import { ApiService } from './apiService';

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

// Storage keys for localStorage
const CART_STORAGE_KEY = 'cart-storage';
const SESSION_ID_KEY = 'skinior-session-id';

// Helper functions for session management
const getStoredSessionId = (): string => {
  if (typeof window === 'undefined') return generateSessionId();
  
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

const generateSessionId = (): string => {
  // Generate a UUID-like session ID
  return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

const saveSessionId = (sessionId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_ID_KEY, sessionId);
};

// Helper functions for cart persistence (for Zustand compatibility)
const saveCartToStorage = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Save in the same format that Zustand expects
    const storage = {
      state: { cart },
      version: 1
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};

// Configuration constants
const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;

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
  // Get or create cart using session-based API
  async getCart(): Promise<Cart> {
    try {
      const sessionId = getStoredSessionId();
      
      // Use the new /cart/current endpoint that handles both user and session carts
      const response = await ApiService.authenticatedFetch(`/cart/current?sessionId=${encodeURIComponent(sessionId)}`, {
        requireAuth: false
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const cart = result.data;
      
      // Save to localStorage for Zustand compatibility
      saveCartToStorage(cart);
      return cart;
    } catch (error) {
      console.error('Get cart error:', error);
      throw new CartServiceError('Failed to get cart', 'GET_CART_ERROR', error);
    }
  }

  // Migrate session cart to user cart when user logs in
  async migrateSessionCartToUser(): Promise<Cart> {
    try {
      const sessionId = getStoredSessionId();
      
      const response = await ApiService.authenticatedFetch('/cart/migrate', {
        method: 'POST',
        requireAuth: false, // The controller will check for auth internally
        body: JSON.stringify({ sessionId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const cart = result.data;
      
      // Save to localStorage
      saveCartToStorage(cart);
      return cart;
    } catch (error) {
      console.error('Migrate cart error:', error);
      throw new CartServiceError('Failed to migrate cart', 'MIGRATE_CART_ERROR', error);
    }
  }

  // Add item to cart
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    try {
      // Validate request
      validateAddToCartRequest(request);

      // Get current cart to ensure we have a cart ID
      const currentCart = await this.getCart();
      const sessionId = getStoredSessionId();

      // Add item to cart via API
      const response = await ApiService.authenticatedFetch(`/cart/${currentCart.id}/items?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({
          productId: request.productId,
          quantity: request.quantity
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const updatedCart = result.data;
      
      // Save to localStorage for Zustand compatibility
      saveCartToStorage(updatedCart);

      return updatedCart;
    } catch (error) {
      console.error('Add to cart error:', error);
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

      const currentCart = await this.getCart();
      const sessionId = getStoredSessionId();

      // Update item via API
      const response = await ApiService.authenticatedFetch(`/cart/${currentCart.id}/items/${request.itemId}?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'PUT',
        requireAuth: false,
        body: JSON.stringify({
          quantity: request.quantity
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ItemNotFoundError(request.itemId);
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const updatedCart = result.data;
      
      // Save to localStorage for Zustand compatibility
      saveCartToStorage(updatedCart);

      return updatedCart;
    } catch (error) {
      console.error('Update cart item error:', error);
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

      const currentCart = await this.getCart();
      const sessionId = getStoredSessionId();

      // Remove item via API
      const response = await ApiService.authenticatedFetch(`/cart/${currentCart.id}/items/${itemId}?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
        requireAuth: false
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ItemNotFoundError(itemId);
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const updatedCart = result.data;
      
      // Save to localStorage for Zustand compatibility
      saveCartToStorage(updatedCart);

      return updatedCart;
    } catch (error) {
      console.error('Remove cart item error:', error);
      if (error instanceof CartServiceError) {
        throw error;
      }
      throw new CartServiceError('Failed to remove cart item', 'REMOVE_ITEM_ERROR', error);
    }
  }

  // Clear cart
  async clearCart(): Promise<Cart> {
    try {
      const currentCart = await this.getCart();
      const sessionId = getStoredSessionId();

      // Clear cart via API
      const response = await ApiService.authenticatedFetch(`/cart/${currentCart.id}?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
        requireAuth: false
      });

      if (!response.ok && response.status !== 404) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Create new cart after clearing
      return await this.getCart();
    } catch (error) {
      console.error('Clear cart error:', error);
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

// Export session management functions for external use
export { getStoredSessionId, generateSessionId, saveSessionId };
