import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/lib/store/cart-store';
import { cartService } from '@/services/cartService';
import type { AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';

// Mock the cart service
vi.mock('@/services/cartService', () => ({
  cartService: {
    getCart: vi.fn(),
    addToCart: vi.fn(),
    updateCartItem: vi.fn(),
    removeCartItem: vi.fn(),
    clearCart: vi.fn(),
  },
}));

const mockCartService = vi.mocked(cartService);

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Reset the store state
    act(() => {
      useCartStore.setState({
        cart: null,
        isLoading: false,
        isDrawerOpen: false,
        error: null,
      });
    });
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCartStore());
      
      expect(result.current.cart).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isDrawerOpen).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('addToCart', () => {
    it('should successfully add item to cart', async () => {
      const mockCart = {
        id: 'cart-1',
        items: [
          {
            id: 'item-1',
            productId: 'prod-1',
            variantId: 'var-1',
            quantity: 2,
            price: 25.99,
            image: '/product-holder.webp',
            title: 'Test Product',
            titleAr: 'منتج تجريبي',
          },
        ],
        itemCount: 2,
        subtotal: 51.98,
        tax: 8.32,
        shipping: 0,
        total: 60.30,
        currency: 'JOD',
        updatedAt: new Date().toISOString(),
      };

      mockCartService.addToCart.mockResolvedValue(mockCart);

      const { result } = renderHook(() => useCartStore());

      const addToCartRequest: AddToCartRequest = {
        productId: 'prod-1',
        variantId: 'var-1',
        quantity: 2,
      };

      await act(async () => {
        await result.current.addToCart(addToCartRequest);
      });

      expect(mockCartService.addToCart).toHaveBeenCalledWith(addToCartRequest);
      expect(result.current.cart).toEqual(mockCart);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isDrawerOpen).toBe(true); // Should auto-open drawer
      expect(result.current.error).toBeNull();
    });

    it('should handle add to cart error', async () => {
      const errorMessage = 'Failed to add item to cart';
      mockCartService.addToCart.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCartStore());

      const addToCartRequest: AddToCartRequest = {
        productId: 'prod-1',
        variantId: 'var-1',
        quantity: 1,
      };

      await act(async () => {
        await result.current.addToCart(addToCartRequest);
      });

      expect(result.current.error).toEqual({
        code: 'ADD_TO_CART_ERROR',
        message: errorMessage,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.cart).toBeNull();
    });

    it('should set loading state during add to cart', async () => {
      mockCartService.addToCart.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useCartStore());

      const addToCartRequest: AddToCartRequest = {
        productId: 'prod-1',
        variantId: 'var-1',
        quantity: 1,
      };

      act(() => {
        result.current.addToCart(addToCartRequest);
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('updateItem', () => {
    it('should successfully update cart item', async () => {
      const mockCart = {
        id: 'cart-1',
        items: [
          {
            id: 'item-1',
            productId: 'prod-1',
            variantId: 'var-1',
            quantity: 3,
            price: 25.99,
            image: '/product-holder.webp',
            title: 'Test Product',
            titleAr: 'منتج تجريبي',
          },
        ],
        itemCount: 3,
        subtotal: 77.97,
        tax: 12.48,
        shipping: 0,
        total: 90.45,
        currency: 'JOD',
        updatedAt: new Date().toISOString(),
      };

      mockCartService.updateCartItem.mockResolvedValue(mockCart);

      const { result } = renderHook(() => useCartStore());

      const updateRequest: UpdateCartItemRequest = {
        itemId: 'item-1',
        quantity: 3,
      };

      await act(async () => {
        await result.current.updateItem(updateRequest);
      });

      expect(mockCartService.updateCartItem).toHaveBeenCalledWith(updateRequest);
      expect(result.current.cart).toEqual(mockCart);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle update item error', async () => {
      const errorMessage = 'Failed to update item';
      mockCartService.updateCartItem.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCartStore());

      const updateRequest: UpdateCartItemRequest = {
        itemId: 'item-1',
        quantity: 3,
      };

      await act(async () => {
        await result.current.updateItem(updateRequest);
      });

      expect(result.current.error).toEqual({
        code: 'UPDATE_ITEM_ERROR',
        message: errorMessage,
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('should successfully remove item from cart', async () => {
      const mockCart = {
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

      mockCartService.removeCartItem.mockResolvedValue(mockCart);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.removeItem('item-1');
      });

      expect(mockCartService.removeCartItem).toHaveBeenCalledWith('item-1');
      expect(result.current.cart).toEqual(mockCart);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle remove item error', async () => {
      const errorMessage = 'Failed to remove item';
      mockCartService.removeCartItem.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.removeItem('item-1');
      });

      expect(result.current.error).toEqual({
        code: 'REMOVE_ITEM_ERROR',
        message: errorMessage,
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('clearCart', () => {
    it('should successfully clear cart', async () => {
      const mockCart = {
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

      mockCartService.clearCart.mockResolvedValue(mockCart);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.clearCart();
      });

      expect(mockCartService.clearCart).toHaveBeenCalled();
      expect(result.current.cart).toEqual(mockCart);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle clear cart error', async () => {
      const errorMessage = 'Failed to clear cart';
      mockCartService.clearCart.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.clearCart();
      });

      expect(result.current.error).toEqual({
        code: 'CLEAR_CART_ERROR',
        message: errorMessage,
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadCart', () => {
    it('should successfully load cart', async () => {
      const mockCart = {
        id: 'cart-1',
        items: [
          {
            id: 'item-1',
            productId: 'prod-1',
            variantId: 'var-1',
            quantity: 1,
            price: 25.99,
            image: '/product-holder.webp',
            title: 'Test Product',
            titleAr: 'منتج تجريبي',
          },
        ],
        itemCount: 1,
        subtotal: 25.99,
        tax: 4.16,
        shipping: 5,
        total: 35.15,
        currency: 'JOD',
        updatedAt: new Date().toISOString(),
      };

      mockCartService.getCart.mockResolvedValue(mockCart);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.loadCart();
      });

      expect(mockCartService.getCart).toHaveBeenCalled();
      expect(result.current.cart).toEqual(mockCart);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle load cart error', async () => {
      const errorMessage = 'Failed to load cart';
      mockCartService.getCart.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.loadCart();
      });

      expect(result.current.error).toEqual({
        code: 'LOAD_CART_ERROR',
        message: errorMessage,
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('UI Actions', () => {
    it('should open drawer', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openDrawer();
      });

      expect(result.current.isDrawerOpen).toBe(true);
    });

    it('should close drawer', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openDrawer();
        result.current.closeDrawer();
      });

      expect(result.current.isDrawerOpen).toBe(false);
    });

    it('should toggle drawer', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.toggleDrawer();
      });

      expect(result.current.isDrawerOpen).toBe(true);

      act(() => {
        result.current.toggleDrawer();
      });

      expect(result.current.isDrawerOpen).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        useCartStore.setState({
          error: { code: 'TEST_ERROR', message: 'Test error' },
        });
      });

      expect(result.current.error).toEqual({
        code: 'TEST_ERROR',
        message: 'Test error',
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Persistence', () => {
    it('should persist cart data to localStorage', async () => {
      const mockCart = {
        id: 'cart-1',
        items: [
          {
            id: 'item-1',
            productId: 'prod-1',
            variantId: 'var-1',
            quantity: 1,
            price: 25.99,
            image: '/product-holder.webp',
            title: 'Test Product',
            titleAr: 'منتج تجريبي',
          },
        ],
        itemCount: 1,
        subtotal: 25.99,
        tax: 4.16,
        shipping: 5,
        total: 35.15,
        currency: 'JOD',
        updatedAt: new Date().toISOString(),
      };

      mockCartService.addToCart.mockResolvedValue(mockCart);

      const { result } = renderHook(() => useCartStore());

      const addToCartRequest: AddToCartRequest = {
        productId: 'prod-1',
        variantId: 'var-1',
        quantity: 1,
      };

      await act(async () => {
        await result.current.addToCart(addToCartRequest);
      });

      // Check that localStorage was called to persist the cart
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'cart-storage',
        expect.stringContaining('cart-1')
      );
    });
  });
});
