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
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      // Initial state
      cart: null,
      isLoading: false,
      isDrawerOpen: false,
      error: null,

      // Cart actions
      addToCart: async (request: AddToCartRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedCart = await cartService.addToCart(request);
          set({ 
            cart: updatedCart, 
            isLoading: false,
            isDrawerOpen: true // Auto-open drawer when item is added
          });
        } catch (error) {
          set({ 
            error: { 
              code: 'ADD_TO_CART_ERROR', 
              message: error instanceof Error ? error.message : 'Failed to add item to cart' 
            },
            isLoading: false 
          });
        }
      },

      updateItem: async (request: UpdateCartItemRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedCart = await cartService.updateCartItem(request);
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: 'UPDATE_ITEM_ERROR', 
              message: error instanceof Error ? error.message : 'Failed to update item' 
            },
            isLoading: false 
          });
        }
      },

      removeItem: async (itemId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedCart = await cartService.removeCartItem(itemId);
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: 'REMOVE_ITEM_ERROR', 
              message: error instanceof Error ? error.message : 'Failed to remove item' 
            },
            isLoading: false 
          });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedCart = await cartService.clearCart();
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: 'CLEAR_CART_ERROR', 
              message: error instanceof Error ? error.message : 'Failed to clear cart' 
            },
            isLoading: false 
          });
        }
      },

      loadCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const cart = await cartService.getCart();
          set({ cart, isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: 'LOAD_CART_ERROR', 
              message: error instanceof Error ? error.message : 'Failed to load cart' 
            },
            isLoading: false 
          });
        }
      },

      // UI actions
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      // Error handling
      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }), // Only persist cart data, not loading states
    }
  )
);

// Convenience hooks for specific data
export const useCart = () => useCartStore((state) => state.cart);
export const useCartCount = () => useCartStore((state) => state.cart?.itemCount || 0);
export const useCartTotal = () => useCartStore((state) => state.cart?.total || 0);
export const useCartIsLoading = () => useCartStore((state) => state.isLoading);
export const useCartError = () => useCartStore((state) => state.error);

// Individual drawer selectors to avoid infinite loops
export const useCartDrawerOpen = () => useCartStore((state) => state.isDrawerOpen);
export const useCartDrawerClose = () => useCartStore((state) => state.closeDrawer);
export const useCartDrawerToggle = () => useCartStore((state) => state.toggleDrawer);
