import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, AddToCartRequest, UpdateCartItemRequest, CartError } from '../../types/cart';
import { cartService } from '../../services/cartService';

interface CartStore {
  // State
  cart: Cart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  error: CartError | null;
  optimisticUpdates: Set<string>; // Track items being updated optimistically
  
  // Actions
  addToCart: (request: AddToCartRequest) => Promise<void>;
  updateItem: (request: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  
  // UI Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  // Error handling
  clearError: () => void;
  
  // Validation
  validateCartItem: (request: AddToCartRequest) => boolean;
  validateUpdateRequest: (request: UpdateCartItemRequest) => boolean;
}

// Validation functions
const validateAddToCartRequest = (request: AddToCartRequest): boolean => {
  return !!(
    request.productId &&
    request.productId.trim().length > 0 &&
    request.quantity > 0 &&
    request.quantity <= 99 // Reasonable max quantity
  );
};

const validateUpdateRequest = (request: UpdateCartItemRequest): boolean => {
  return !!(
    request.itemId &&
    request.itemId.trim().length > 0 &&
    request.quantity >= 0 &&
    request.quantity <= 99
  );
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      // Auto-load cart on store initialization
      const autoLoadCart = async () => {
        const state = get();
        if (!state.cart && !state.isLoading) {
          try {
            const cart = await cartService.getCart();
            set({ cart });
          } catch (error) {
            console.warn('Failed to auto-load cart:', error);
          }
        }
      };

      // Initialize auto-load after store is created
      setTimeout(() => autoLoadCart(), 0);

      return {
        // Initial state
        cart: null,
        isLoading: false,
        isDrawerOpen: false,
        error: null,
        optimisticUpdates: new Set(),

      // Validation methods
      validateCartItem: validateAddToCartRequest,
      validateUpdateRequest: validateUpdateRequest,

      // Cart actions with improved error handling
      addToCart: async (request: AddToCartRequest) => {
        const state = get();
        
        // Validate request
        if (!state.validateCartItem(request)) {
          set({ 
            error: { 
              code: 'VALIDATION_ERROR', 
              message: 'Invalid cart item data' 
            }
          });
          return;
        }

        // Prevent duplicate requests
        if (state.isLoading) {
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const updatedCart = await cartService.addToCart(request);
          set({ 
            cart: updatedCart, 
            isLoading: false,
            isDrawerOpen: true // Auto-open drawer when item is added
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
          set({ 
            error: { 
              code: 'ADD_TO_CART_ERROR', 
              message: errorMessage,
              details: error
            },
            isLoading: false 
          });
          console.error('Add to cart error:', error);
        }
      },

      updateItem: async (request: UpdateCartItemRequest) => {
        const state = get();
        
        // Validate request
        if (!state.validateUpdateRequest(request)) {
          set({ 
            error: { 
              code: 'VALIDATION_ERROR', 
              message: 'Invalid update request' 
            }
          });
          return;
        }

        // Prevent duplicate requests for the same item
        if (state.optimisticUpdates.has(request.itemId)) {
          return;
        }

        set({ 
          isLoading: true, 
          error: null,
          optimisticUpdates: new Set([...state.optimisticUpdates, request.itemId])
        });
        
        try {
          const updatedCart = await cartService.updateCartItem(request);
          set({ 
            cart: updatedCart, 
            isLoading: false,
            optimisticUpdates: new Set([...state.optimisticUpdates].filter(id => id !== request.itemId))
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
          set({ 
            error: { 
              code: 'UPDATE_ITEM_ERROR', 
              message: errorMessage,
              details: error
            },
            isLoading: false,
            optimisticUpdates: new Set([...state.optimisticUpdates].filter(id => id !== request.itemId))
          });
          console.error('Update item error:', error);
        }
      },

      removeItem: async (itemId: string) => {
        const state = get();
        
        if (!itemId || itemId.trim().length === 0) {
          set({ 
            error: { 
              code: 'VALIDATION_ERROR', 
              message: 'Invalid item ID' 
            }
          });
          return;
        }

        // Prevent duplicate requests
        if (state.optimisticUpdates.has(itemId)) {
          return;
        }

        set({ 
          isLoading: true, 
          error: null,
          optimisticUpdates: new Set([...state.optimisticUpdates, itemId])
        });
        
        try {
          const updatedCart = await cartService.removeCartItem(itemId);
          set({ 
            cart: updatedCart, 
            isLoading: false,
            optimisticUpdates: new Set([...state.optimisticUpdates].filter(id => id !== itemId))
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
          set({ 
            error: { 
              code: 'REMOVE_ITEM_ERROR', 
              message: errorMessage,
              details: error
            },
            isLoading: false,
            optimisticUpdates: new Set([...state.optimisticUpdates].filter(id => id !== itemId))
          });
          console.error('Remove item error:', error);
        }
      },

      clearCart: async () => {
        const state = get();
        
        if (state.isLoading) {
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const updatedCart = await cartService.clearCart();
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
          set({ 
            error: { 
              code: 'CLEAR_CART_ERROR', 
              message: errorMessage,
              details: error
            },
            isLoading: false 
          });
          console.error('Clear cart error:', error);
        }
      },

      loadCart: async () => {
        const state = get();
        
        if (state.isLoading) {
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const cart = await cartService.getCart();
          set({ cart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load cart';
          set({ 
            error: { 
              code: 'LOAD_CART_ERROR', 
              message: errorMessage,
              details: error
            },
            isLoading: false 
          });
          console.error('Load cart error:', error);
        }
      },

      // UI actions
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      // Error handling
      clearError: () => set({ error: null }),
      };
    },
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }), // Only persist cart data, not loading states
      version: 1, // Add version for future migrations
      migrate: (persistedState: unknown, version: number) => {
        // Handle future migrations here
        if (version === 0) {
          // Migrate from version 0 to 1
          return { ...(persistedState as Record<string, unknown>), version: 1 };
        }
        return persistedState;
      },
    }
  )
);

// Convenience hooks for specific data - memoized to prevent infinite loops
export const useCart = () => useCartStore((state) => state.cart);
export const useCartCount = () => useCartStore((state) => state.cart?.itemCount ?? 0);
export const useCartTotal = () => useCartStore((state) => state.cart?.total ?? 0);
export const useCartIsLoading = () => useCartStore((state) => state.isLoading);
export const useCartError = () => useCartStore((state) => state.error);
export const useCartOptimisticUpdates = () => useCartStore((state) => state.optimisticUpdates);

// Individual drawer selectors to avoid infinite loops
export const useCartDrawerOpen = () => useCartStore((state) => state.isDrawerOpen);
export const useCartDrawerClose = () => useCartStore((state) => state.closeDrawer);
export const useCartDrawerToggle = () => useCartStore((state) => state.toggleDrawer);

// Validation hooks - memoized to prevent infinite loops
export const useCartValidation = () => useCartStore((state) => state.validateCartItem);
export const useCartUpdateValidation = () => useCartStore((state) => state.validateUpdateRequest);
