"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { checkoutService, OrderResponse } from "@/services/checkoutService";
import { authService } from "@/services/authService";
import Image from "next/image";
import Link from "next/link";

const AccountOrdersPage: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const loadUserAndOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          setError(t("account.orders.loginRequired"));
          setLoading(false);
          return;
        }

        // Get current user
        const user = await authService.getProfile();
        setUserEmail(user.email);

        // Load orders for the user
        const orderHistory = await checkoutService.getOrderHistory(user.email);
        setOrders(orderHistory.data.orders);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError(
          err instanceof Error ? err.message : t("account.orders.loadError")
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserAndOrders();
  }, [t]);

  const formatPrice = (price: number | undefined | null) => {
    const safePrice = price ?? 0;
    return isRTL
      ? `${safePrice.toFixed(2)} د.أ`
      : `JOD ${safePrice.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(isRTL ? "ar-JO" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusKey = `account.orders.status.${status.toLowerCase()}`;
    return t(statusKey) !== statusKey ? t(statusKey) : status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
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
              </div>
              <h2
                className={`text-xl font-semibold text-gray-900 mb-2 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {t("account.orders.error.title")}
              </h2>
              <p className={`text-gray-600 mb-6 ${isRTL ? "font-cairo" : ""}`}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className={`bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {t("account.orders.error.retry")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/${locale}/`}>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg
                  className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            </Link>
            <h1
              className={`text-3xl font-bold text-gray-900 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {t("account.orders.title")}
            </h1>
          </div>
          <p className={`text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
            {t("account.orders.subtitle")}
            {userEmail && (
              <span className="block text-sm text-gray-500 mt-1">
                {userEmail}
              </span>
            )}
          </p>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                  />
                </svg>
              </div>
              <h3
                className={`text-xl font-semibold text-gray-900 mb-2 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {t("account.orders.empty.title")}
              </h3>
              <p className={`text-gray-600 mb-6 ${isRTL ? "font-cairo" : ""}`}>
                {t("account.orders.empty.description")}
              </p>
              <Link href={`/${locale}/shop`}>
                <button
                  className={`bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {t("account.orders.empty.shopNow")}
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6">
                  {/* Order Header */}
                  <div
                    className={`flex items-start justify-between mb-6 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div>
                      <h3
                        className={`text-lg font-semibold text-gray-900 mb-1 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {t("account.orders.orderNumber")}: {order.orderNumber}
                      </h3>
                      <p
                        className={`text-sm text-gray-600 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {t("account.orders.placedOn")}:{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className={`text-right ${isRTL ? "text-left" : ""}`}>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )} ${isRTL ? "font-cairo" : ""}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <p
                        className={`text-lg font-semibold text-gray-900 mt-2 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/product-holder.webp"}
                            alt={item.title || "Product"}
                            width={64}
                            height={64}
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/product-holder.webp";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-medium text-gray-900 text-sm ${
                              isRTL ? "font-cairo text-right" : ""
                            }`}
                          >
                            {item.title}
                          </h4>
                          <p
                            className={`text-sm text-gray-600 ${
                              isRTL ? "font-cairo text-right" : ""
                            }`}
                          >
                            {t("account.orders.quantity")}: {item.quantity} ×{" "}
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div
                          className={`text-right ${isRTL ? "text-left" : ""}`}
                        >
                          <p
                            className={`font-semibold text-gray-900 text-sm ${
                              isRTL ? "font-cairo" : ""
                            }`}
                          >
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div
                    className={`border-t border-gray-200 pt-4 ${
                      isRTL ? "text-right" : ""
                    }`}
                  >
                    <div className="space-y-2 text-sm">
                      <div
                        className={`flex justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span
                          className={`text-gray-600 ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {t("account.orders.subtotal")}
                        </span>
                        <span
                          className={`font-medium ${isRTL ? "font-cairo" : ""}`}
                        >
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span
                          className={`text-gray-600 ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {t("account.orders.shipping")}
                        </span>
                        <span
                          className={`font-medium ${isRTL ? "font-cairo" : ""}`}
                        >
                          {order.shipping === 0
                            ? t("account.orders.freeShipping")
                            : formatPrice(order.shipping)}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span
                          className={`text-gray-600 ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {t("account.orders.tax")}
                        </span>
                        <span
                          className={`font-medium ${isRTL ? "font-cairo" : ""}`}
                        >
                          {formatPrice(order.tax)}
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div
                        className={`flex justify-between text-base font-semibold ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span
                          className={`text-gray-900 ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {t("account.orders.total")}
                        </span>
                        <span
                          className={`text-gray-900 ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div
                    className={`mt-6 pt-4 border-t border-gray-200 ${
                      isRTL ? "text-right" : ""
                    }`}
                  >
                    <h4
                      className={`font-medium text-gray-900 mb-2 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {t("account.orders.shippingAddress")}
                    </h4>
                    <div
                      className={`text-sm text-gray-600 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      <p>
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      <p>{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountOrdersPage;
