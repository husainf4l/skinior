"use client";

import { useState, useCallback } from "react";
import { useCartStore, useCartError, useCartValidation } from "../../lib/store/cart-store";
import { AddToCartRequest, CartItemAttribute } from "../../types/cart";
import { useTranslations } from "next-intl";
import { type AttributeSelection } from "../product/ProductAttributeSelector";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  showFeedback?: boolean;
  selectedAttributes?: AttributeSelection;
}

export default function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  disabled = false,
  className = "",
  children,
  onSuccess,
  onError,
  showFeedback = true,
  selectedAttributes,
}: AddToCartButtonProps) {
  const t = useTranslations();
  const { addToCart, isLoading, clearError } = useCartStore();
  const validateCartItem = useCartValidation();
  const cartError = useCartError();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Clear errors when component unmounts or when cart error changes
  const clearLocalError = useCallback(() => {
    setLocalError(null);
    clearError();
  }, [clearError]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any previous errors
    clearLocalError();

    // Validate input props
    if (!productId || typeof productId !== 'string') {
      const errorMsg = 'Invalid product ID';
      setLocalError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (typeof quantity !== 'number' || quantity < 1 || quantity > 99) {
      const errorMsg = 'Invalid quantity';
      setLocalError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (disabled || isLoading) {
      return;
    }

    // Convert selectedAttributes to cart format
    const cartAttributes: CartItemAttribute[] = selectedAttributes 
      ? Object.entries(selectedAttributes)
          .filter(([, value]) => value !== null && value !== undefined)
          .map(([attributeName, value]) => ({
            attributeName,
            value: value!,
          }))
      : [];

    const request: AddToCartRequest = {
      productId,
      variantId,
      quantity,
      attributes: cartAttributes.length > 0 ? cartAttributes : undefined,
    };

    // Validate request before sending
    if (!validateCartItem(request)) {
      const errorMsg = 'Invalid cart item data';
      setLocalError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      await addToCart(request);
      
      // Show success feedback
      if (showFeedback) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
      
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      setLocalError(errorMessage);
      onError?.(errorMessage);
      console.error("Failed to add to cart:", error);
    }
  };

  // Determine button state
  const isDisabled = disabled || isLoading;
  const hasError = localError || cartError;
  const buttonText = showSuccess 
    ? t("products.added") 
    : isLoading 
    ? t("products.adding") 
    : children || t("products.addToCart");

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          w-full px-3 py-2 text-sm font-medium rounded-lg 
          transition-all duration-200 transform active:scale-95
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-300"
              : showSuccess
              ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              : hasError
              ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
              : "bg-black text-white hover:bg-gray-800 focus:ring-gray-900"
          }
          ${className}
        `}
        type="button"
        aria-label={t("products.addToCart")}
        aria-describedby={hasError ? "cart-error" : undefined}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {buttonText}
          </span>
        ) : showSuccess ? (
          <span className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {buttonText}
          </span>
        ) : (
          buttonText
        )}
      </button>

      {/* Error message */}
      {hasError && (
        <div
          id="cart-error"
          className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700"
          role="alert"
        >
          <div className="flex items-start">
            <svg
              className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
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
          </div>
        </div>
      )}

      {/* Success message */}
      {showSuccess && (
        <div
          className="absolute top-full left-0 right-0 mt-1 p-2 bg-green-50 border border-green-200 rounded-md text-xs text-green-700"
          role="status"
        >
          <div className="flex items-start">
            <svg
              className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{t("products.addedSuccessfully")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
