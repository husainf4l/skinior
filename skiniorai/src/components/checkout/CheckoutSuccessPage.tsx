"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CheckoutSuccessPage: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState<string>("");

  // Get order number from URL params or generate a stable one client-side
  useEffect(() => {
    const orderNum =
      searchParams.get("orderNumber") ||
      searchParams.get("order") ||
      `SK${Date.now().toString().slice(-6)}`;
    setOrderNumber(orderNum);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>

          {/* Success Message */}
          <h1
            className={`text-3xl font-bold text-gray-900 mb-4 ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("checkout.successTitle")}
          </h1>
          <p className={`text-gray-600 mb-6 ${isRTL ? "font-cairo" : ""}`}>
            {t("checkout.successMessage")}
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2
              className={`text-lg font-semibold text-gray-900 mb-4 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {t("checkout.orderDetails")}
            </h2>
            <div className={`space-y-2 text-sm ${isRTL ? "font-cairo" : ""}`}>
              <div
                className={`flex justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-gray-600">
                  {t("checkout.orderNumber")}:
                </span>
                <span className="font-medium">{orderNumber || "SK000000"}</span>
              </div>
              <div
                className={`flex justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-gray-600">
                  {t("checkout.estimatedDelivery")}:
                </span>
                <span className="font-medium">
                  3-5 {t("checkout.businessDays")}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <p className={`text-sm text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
              {t("checkout.emailConfirmation")}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href={`/${locale}/shop`}>
                <button
                  className={`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {t("checkout.continueShopping")}
                </button>
              </Link>

              <Link href={`/${locale}/account/orders`}>
                <button
                  className={`w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {t("checkout.viewOrders")}
                </button>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className={`text-sm text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
              {t("checkout.supportMessage")}
            </p>
            <Link href={`/${locale}/contact`}>
              <span
                className={`text-sm text-black hover:underline ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {t("checkout.contactSupport")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
