"use client";

import { useCartStore } from "../../lib/store/cart-store";
import { AddToCartRequest } from "../../types/cart";
import { useTranslations } from "next-intl";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  disabled = false,
  className = "",
  children,
}: AddToCartButtonProps) {
  const t = useTranslations();
  const { addToCart, isLoading } = useCartStore();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isLoading) return;

    const request: AddToCartRequest = {
      productId,
      variantId,
      quantity,
    };

    try {
      await addToCart(request);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        w-full px-3 py-2 text-sm font-medium rounded-lg 
        transition-all duration-200 transform active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          disabled || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-300"
            : "bg-black text-white hover:bg-gray-800 focus:ring-gray-900"
        }
        ${className}
      `}
      type="button"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
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
          {t("products.adding")}
        </span>
      ) : (
        children || t("products.addToCart")
      )}
    </button>
  );
}
