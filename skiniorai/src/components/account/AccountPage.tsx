"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const AccountPage: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {t("account.title")}
            </h1>
          </div>
          <p className={`text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
            {t("account.description")}
          </p>
        </div>

        {/* Account Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders */}
          <Link href={`/${locale}/account/orders`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold text-gray-900 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {t("account.orders.title")}
                  </h3>
                  <p
                    className={`text-gray-600 text-sm ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {t("account.orders.subtitle")}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 ${
                    isRTL ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold text-gray-900 mb-1 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  Account Settings
                </h3>
                <p
                  className={`text-gray-600 text-sm ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  Manage your account preferences (Coming Soon)
                </p>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold text-gray-900 mb-1 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  Profile Information
                </h3>
                <p
                  className={`text-gray-600 text-sm ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  Update your personal information (Coming Soon)
                </p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold text-gray-900 mb-1 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  Saved Addresses
                </h3>
                <p
                  className={`text-gray-600 text-sm ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  Manage your shipping addresses (Coming Soon)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2
            className={`text-xl font-semibold text-gray-900 mb-4 ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link href={`/${locale}/shop`}>
              <button
                className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  isRTL ? "text-right" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
                <span
                  className={`font-medium text-gray-900 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  Continue Shopping
                </span>
              </button>
            </Link>

            <Link href={`/${locale}/skin-analysis`}>
              <button
                className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  isRTL ? "text-right" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span
                  className={`font-medium text-gray-900 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  Get Skin Analysis
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
