"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import {
  useCartStore,
  useCart,
  useCartDrawerOpen,
  useCartDrawerClose,
  useCartError,
  useCartOptimisticUpdates,
} from "../../lib/store/cart-store";
import Image from "next/image";

export default function CartDrawer() {
  const locale = useLocale();
  const cart = useCart();
  const isOpen = useCartDrawerOpen();
  const close = useCartDrawerClose();
  const { updateItem, removeItem, loadCart, clearError } = useCartStore();
  const cartError = useCartError();
  const optimisticUpdates = useCartOptimisticUpdates();
  const isRTL = locale === "ar";
  
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Load cart on mount
  useEffect(() => {
    if (!cart) {
      loadCart();
    }
  }, [cart, loadCart]);

  // Clear errors when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setLocalError(null);
      clearError();
    }
  }, [isOpen, clearError]);

  const formatPrice = (price: number) => {
    return isRTL ? `${price.toFixed(2)} د.أ` : `JOD ${price.toFixed(2)}`;
  };

  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    if (!itemId || typeof newQuantity !== 'number') {
      setLocalError('Invalid quantity');
      return;
    }

    setIsUpdating(itemId);
    setLocalError(null);
    clearError();

    try {
      if (newQuantity <= 0) {
        await removeItem(itemId);
      } else {
        await updateItem({ itemId, quantity: newQuantity });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update quantity';
      setLocalError(errorMessage);
      console.error('Quantity update error:', error);
    } finally {
      setIsUpdating(null);
    }
  }, [removeItem, updateItem, clearError]);

  const handleRemoveItem = useCallback(async (itemId: string) => {
    if (!itemId) {
      setLocalError('Invalid item ID');
      return;
    }

    setIsUpdating(itemId);
    setLocalError(null);
    clearError();

    try {
      await removeItem(itemId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
      setLocalError(errorMessage);
      console.error('Remove item error:', error);
    } finally {
      setIsUpdating(null);
    }
  }, [removeItem, clearError]);

  const handleClose = useCallback(() => {
    setLocalError(null);
    clearError();
    close();
  }, [close, clearError]);

  if (!isOpen) return null;

  const hasError = localError || cartError;

  return (
    <>
      {/* Simple Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleClose}
        aria-label="Close cart"
      />

      {/* Clean Cart Drawer */}
      <div
        className={`fixed inset-y-0 ${
          isRTL ? "left-0" : "right-0"
        } w-full max-w-lg z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0"
            : isRTL
            ? "-translate-x-full"
            : "translate-x-full"
        }`}
      >
        {/* Content Container */}
        <div className="h-full flex flex-col">
          {/* Simple Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-500">
                  {cart?.itemCount || 0} {cart?.itemCount === 1 ? "item" : "items"}
                </p>
              </div>

              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {hasError && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2 text-red-700 text-sm">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{localError || cartError?.message}</span>
                <button
                  onClick={() => {
                    setLocalError(null);
                    clearError();
                  }}
                  className="ml-auto text-red-500 hover:text-red-700"
                  aria-label="Dismiss error"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-6 py-4 space-y-4">
              {!cart?.items || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
                  {/* Simple, Clean Icon */}
                  <div className="mb-6">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                      />
                    </svg>
                  </div>

                  {/* Simple Text */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500">
                      Browse our products and add items to your cart
                    </p>
                  </div>

                  {/* Single Action Button */}
                  <button
                    className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      handleClose();
                      if (typeof window !== "undefined") {
                        window.location.href = `/${locale}/shop`;
                      }
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item, index) => {
                    const isItemUpdating = isUpdating === item.id;
                    const isOptimistic = optimisticUpdates.has(item.id);
                    
                    return (
                      <div
                        key={item.id}
                        className={`group relative p-4 border border-gray-200 rounded-lg bg-white ${
                          isItemUpdating || isOptimistic ? 'opacity-75 pointer-events-none' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={
                                isRTL
                                  ? item.titleAr || item.title
                                  : item.title
                              }
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">
                                {isRTL
                                  ? item.titleAr || item.title
                                  : item.title}
                              </h3>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isItemUpdating || isOptimistic}
                                className="text-gray-400 hover:text-red-500 p-1 disabled:opacity-50"
                                aria-label="Remove item"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            
                            <p className="text-sm font-semibold text-gray-900 mb-3">
                              {formatPrice(item.price)}
                            </p>

                            {/* Simple Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={isItemUpdating || isOptimistic}
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="px-3 text-sm font-medium text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={isItemUpdating || isOptimistic}
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Simple Footer */}
          {cart?.items && cart.items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
              {/* Pricing Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(cart.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart.shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(cart.shipping)
                    )}
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                onClick={() => {
                  handleClose();
                  if (typeof window !== "undefined") {
                    window.location.href = `/${locale}/checkout`;
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
