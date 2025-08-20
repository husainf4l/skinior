"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  useCartStore,
  useCart,
  useCartDrawerOpen,
  useCartDrawerClose,
} from "../../lib/store/cart-store";
import Image from "next/image";

export default function CartDrawer() {
  const t = useTranslations();
  const locale = useLocale();
  const cart = useCart();
  const isOpen = useCartDrawerOpen();
  const close = useCartDrawerClose();
  const { updateItem, removeItem, loadCart } = useCartStore();
  const isRTL = locale === "ar";

  // Load cart on mount
  useEffect(() => {
    if (!cart) {
      loadCart();
    }
  }, [cart, loadCart]);

  const formatPrice = (price: number) => {
    return isRTL ? `${price.toFixed(2)} د.أ` : `JOD ${price.toFixed(2)}`;
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
    } else {
      await updateItem({ itemId, quantity: newQuantity });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Revolutionary Modern Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-all duration-500 ease-out"
        onClick={close}
        aria-label="Close cart"
        style={{
          background: `
            radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 70%),
            linear-gradient(135deg, rgba(15,23,42,0.3) 0%, rgba(30,41,59,0.2) 100%)
          `,
          backdropFilter: "blur(20px) saturate(120%)",
          WebkitBackdropFilter: "blur(20px) saturate(120%)",
        }}
      />

      {/* Next-Generation Cart Drawer */}
      <div
        className={`fixed inset-y-0 ${
          isRTL ? "left-0" : "right-0"
        } w-full max-w-lg z-50 transform transition-all duration-500 ease-out ${
          isOpen
            ? "translate-x-0 opacity-100"
            : isRTL
            ? "-translate-x-full opacity-0"
            : "translate-x-full opacity-0"
        }`}
      >
        {/* Ultra-Modern Glass Container */}
        <div
          className="h-full relative"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255,255,255,0.95) 0%, 
                rgba(248,250,252,0.98) 25%,
                rgba(255,255,255,0.95) 50%,
                rgba(251,252,254,0.98) 75%,
                rgba(255,255,255,0.95) 100%
              )
            `,
            backdropFilter: "blur(40px) saturate(180%) brightness(105%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(105%)",
            borderLeft: isRTL ? "none" : "1px solid rgba(255,255,255,0.8)",
            borderRight: isRTL ? "1px solid rgba(255,255,255,0.8)" : "none",
            boxShadow: `
              ${isRTL ? "-" : ""}25px 0 50px rgba(0,0,0,0.1),
              ${isRTL ? "-" : ""}10px 0 25px rgba(0,0,0,0.05),
              inset 1px 0 0 rgba(255,255,255,0.9)
            `,
          }}
        >
          {/* Premium Content Wrapper */}
          <div className="h-full flex flex-col relative overflow-hidden">
            {/* Modern Header */}
            <div className="relative px-8 py-6 border-b border-gray-100/80">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(249,250,251,0.4) 100%)",
                  backdropFilter: "blur(10px)",
                }}
              />

              <div className="relative flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Shopping Cart
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    {cart?.itemCount || 0}{" "}
                    {cart?.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>

                <button
                  onClick={close}
                  className="p-3 rounded-xl bg-white/70 hover:bg-white/90 border border-gray-100/50 transition-all duration-300 group shadow-sm hover:shadow-md"
                  style={{
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors"
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

            {/* Revolutionary Content Area */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto px-8 py-6 space-y-6">
                {!cart?.items || cart.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8 px-4">
                    {/* Welcoming Header */}
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-700">
                          Ready to glow?
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Animated Icon Container */}
                    <div
                      className="w-36 h-36 rounded-full flex items-center justify-center mb-6 relative group overflow-hidden"
                      style={{
                        background: `
                          radial-gradient(circle at 30% 30%, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.05) 40%, rgba(255,255,255,0.95) 70%),
                          linear-gradient(135deg, 
                            rgba(255,255,255,0.9) 0%, 
                            rgba(248,250,252,0.95) 50%,
                            rgba(255,255,255,0.9) 100%
                          )
                        `,
                        border: "2px solid rgba(59,130,246,0.1)",
                        boxShadow: `
                          0 20px 40px rgba(0,0,0,0.08),
                          0 8px 20px rgba(59,130,246,0.1),
                          inset 0 1px 0 rgba(255,255,255,0.9)
                        `,
                        animation: "fadeInScale 0.6s ease-out",
                      }}
                    >
                      {/* Floating particles effect */}
                      <div className="absolute inset-0">
                        <div
                          className="absolute top-4 left-6 w-1 h-1 bg-blue-400 rounded-full opacity-60"
                          style={{ animation: "float 3s ease-in-out infinite" }}
                        />
                        <div
                          className="absolute top-8 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40"
                          style={{
                            animation: "float 3s ease-in-out infinite 1s",
                          }}
                        />
                        <div
                          className="absolute bottom-6 left-8 w-1 h-1 bg-pink-400 rounded-full opacity-50"
                          style={{
                            animation: "float 3s ease-in-out infinite 2s",
                          }}
                        />
                      </div>

                      {/* Premium Cart Icon */}
                      <div className="relative z-10">
                        <svg
                          className="h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-all duration-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Compelling Messaging */}
                    <div className="space-y-3 mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Let's find your perfect skincare
                      </h3>
                      <p className="text-gray-600 max-w-sm leading-relaxed">
                        Explore our curated collection of premium products
                        designed to transform your skin
                      </p>
                    </div>

                    {/* Primary Action */}
                    <div className="w-full max-w-sm mb-6">
                      <button
                        className="w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg active:scale-[0.98] group relative overflow-hidden"
                        style={{
                          background: `
                            linear-gradient(135deg, 
                              #3b82f6 0%, 
                              #2563eb 50%,
                              #1d4ed8 100%
                            )
                          `,
                          color: "white",
                          boxShadow: "0 8px 20px rgba(59,130,246,0.25)",
                        }}
                        onClick={() => {
                          close();
                          // Add navigation to products page
                          if (typeof window !== "undefined") {
                            window.location.href = `/${locale}/products`;
                          }
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                          </svg>
                          <span>Discover Products</span>
                        </div>
                      </button>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-8">
                      <button
                        className="py-3 px-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 text-center group"
                        onClick={() => {
                          close();
                          if (typeof window !== "undefined") {
                            window.location.href = `/${locale}/shop`;
                          }
                        }}
                      >
                        <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                          Shop All
                        </div>
                      </button>

                      <button
                        className="py-3 px-4 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-300 text-center group"
                        onClick={() => {
                          close();
                          if (typeof window !== "undefined") {
                            window.location.href = `/${locale}/routines`;
                          }
                        }}
                      >
                        <div className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                          Routines
                        </div>
                      </button>
                    </div>

                    {/* Trust Elements */}
                    <div className="space-y-3 w-full max-w-sm">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-green-800">
                          Free shipping over $75
                        </span>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100/50">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-blue-800">
                          30-day guarantee
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="group relative"
                        style={{
                          animation: `slideInUp 0.6s ease-out ${
                            index * 100
                          }ms both`,
                        }}
                      >
                        {/* Revolutionary Product Card */}
                        <div
                          className="relative p-6 rounded-3xl transition-all duration-500 hover:scale-[1.02] group"
                          style={{
                            background: `
                              linear-gradient(135deg, 
                                rgba(255,255,255,0.9) 0%, 
                                rgba(248,250,252,0.8) 30%,
                                rgba(255,255,255,0.9) 70%,
                                rgba(251,252,254,0.8) 100%
                              )
                            `,
                            border: "1px solid rgba(255,255,255,0.8)",
                            boxShadow: `
                              0 10px 40px rgba(0,0,0,0.08),
                              0 4px 20px rgba(0,0,0,0.04),
                              inset 0 1px 0 rgba(255,255,255,0.9)
                            `,
                          }}
                        >
                          <div className="flex items-start gap-5">
                            {/* Premium Product Image */}
                            <div className="relative overflow-hidden rounded-2xl flex-shrink-0">
                              <div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                  background:
                                    "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.02) 100%)",
                                }}
                              />
                              <Image
                                src={item.image}
                                alt={
                                  isRTL
                                    ? item.titleAr || item.title
                                    : item.title
                                }
                                width={90}
                                height={90}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                style={{
                                  filter:
                                    "contrast(105%) saturate(110%) brightness(102%)",
                                }}
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 space-y-3">
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 truncate">
                                  {isRTL
                                    ? item.titleAr || item.title
                                    : item.title}
                                </h3>
                                <p className="text-xl font-bold text-gray-900">
                                  {formatPrice(item.price)}
                                </p>
                              </div>

                              {/* Modern Quantity Controls */}
                              <div className="flex items-center justify-between">
                                <div
                                  className="flex items-center rounded-2xl bg-white/80 p-1 border border-gray-100"
                                  style={{
                                    boxShadow:
                                      "0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 active:scale-95"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20 12H4"
                                      />
                                    </svg>
                                  </button>
                                  <span className="text-lg font-bold text-gray-900 w-12 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 active:scale-95"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                                  aria-label="Remove item"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Revolutionary Premium Footer */}
            {cart?.items && cart.items.length > 0 && (
              <div
                className="relative px-8 py-8 border-t border-gray-100/80"
                style={{
                  background: `
                    linear-gradient(180deg, 
                      rgba(255,255,255,0.98) 0%, 
                      rgba(249,250,251,0.95) 50%,
                      rgba(255,255,255,0.98) 100%
                    )
                  `,
                  backdropFilter: "blur(20px) saturate(110%)",
                  WebkitBackdropFilter: "blur(20px) saturate(110%)",
                }}
              >
                {/* Elegant Pricing Summary */}
                <div className="space-y-4 mb-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-base text-gray-600">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base text-gray-600">
                      <span className="font-medium">Tax</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(cart.tax)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base text-gray-600">
                      <span className="font-medium">Shipping</span>
                      <span className="font-semibold">
                        {cart.shipping === 0 ? (
                          <span className="text-emerald-600 font-bold">
                            Free
                          </span>
                        ) : (
                          <span className="text-gray-900">
                            {formatPrice(cart.shipping)}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div
                    className="h-px my-4"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(156,163,175,0.3) 50%, transparent 100%)",
                    }}
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                </div>

                {/* Next-Generation Checkout Button */}
                <button
                  className="w-full py-5 text-white rounded-2xl font-bold text-lg tracking-tight transition-all duration-500 hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 group relative overflow-hidden"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        #1e40af 0%, 
                        #3b82f6 25%,
                        #2563eb 50%,
                        #1d4ed8 75%,
                        #1e40af 100%
                      )
                    `,
                    boxShadow: `
                      0 20px 40px rgba(37,99,235,0.3),
                      0 10px 20px rgba(37,99,235,0.2),
                      inset 0 1px 0 rgba(255,255,255,0.2)
                    `,
                  }}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = `/${locale}/checkout`;
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <span>Secure Checkout</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <span>256-bit SSL encrypted checkout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
