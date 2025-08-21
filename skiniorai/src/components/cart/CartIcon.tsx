"use client";

import { useCartCount, useCartDrawerToggle } from "../../lib/store/cart-store";

interface CartIconProps {
  variant?: "filled" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CartIcon({
  variant = "filled",
  size = "md",
  className = "",
}: CartIconProps) {
  const itemCount = useCartCount();
  const toggle = useCartDrawerToggle();

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "p-1.5",
      icon: "h-4 w-4",
      badge: "h-4 w-4 text-xs -top-0.5 -right-0.5",
    },
    md: {
      button: "p-2",
      icon: "h-5 w-5",
      badge: "h-5 w-5 text-xs -top-1 -right-1",
    },
    lg: {
      button: "p-3",
      icon: "h-6 w-6",
      badge: "h-6 w-6 text-sm -top-1.5 -right-1.5",
    },
  };

  const config = sizeConfig[size];

  // Variant styles
  const variantStyles = {
    filled: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
  };

  return (
    <button
      onClick={toggle}
      className={`
        relative ${config.button} rounded-full transition-all duration-200 
        ${variantStyles[variant]} ${className}
      `}
      aria-label={`Shopping cart with ${itemCount} items`}
      type="button"
    >
      {/* Cart Icon */}
      <svg
        className={config.icon}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
        />
      </svg>

      {/* Item Count Badge */}
      {itemCount > 0 && (
        <span
          className={`
            absolute ${config.badge} bg-red-500 text-white rounded-full 
            flex items-center justify-center font-medium
            ring-1 ring-white transition-all duration-200
          `}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
