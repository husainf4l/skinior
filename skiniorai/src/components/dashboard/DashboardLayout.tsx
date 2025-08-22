"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getUserDisplayName, User } from "@/types/user";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../LanguageSwitcher";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  const navigation = [
    {
      name: isRTL ? "لوحة التحكم" : "Dashboard",
      href: `/${locale}/dashboard`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
    },
    {
      name: isRTL ? "المستشار الذكي" : "AI Beauty Advisor",
      href: `/${locale}/room`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      badge: isRTL ? "متاح" : "Available",
      badgeColor: "bg-green-100 text-green-600",
    },
    {
      name: isRTL ? "تحليل البشرة" : "Skin Analysis",
      href: `/${locale}/skin-analysis`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      ),
    },
    {
      name: isRTL ? "خطط العلاج" : "Treatment Plans",
      href: `/${locale}/dashboard/treatments`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      badge: "2",
      badgeColor: "bg-blue-100 text-blue-600",
    },
    {
      name: isRTL ? "سجل الاستشارات" : "Consultation History",
      href: `/${locale}/dashboard/consultations`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      name: isRTL ? "المنتجات" : "Products",
      href: `/${locale}/dashboard/products`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      name: isRTL ? "الطلبات" : "Orders",
      href: `/${locale}/dashboard/orders`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      name: isRTL ? "الملف الشخصي" : "Profile",
      href: `/${locale}/dashboard/profile`,
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-xl border-r border-gray-100 ${
              isRTL ? "mr-auto" : "ml-auto"
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm text-gray-900 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <SidebarContent
              navigation={navigation}
              isRTL={isRTL}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent
          navigation={navigation}
          isRTL={isRTL}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content */}
      <div className={`lg:pl-64 ${isRTL ? "lg:pr-64 lg:pl-0" : ""}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
  }>;
  isRTL: boolean;
  user: User | null;
  onLogout: () => void;
}

function SidebarContent({
  navigation,
  isRTL,
  user,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white/95 backdrop-blur-xl border-r border-gray-100">
      {/* Logo/Brand */}
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6">
          <div className={`ml-3 ${isRTL ? "mr-3 ml-0" : ""}`}>
            <Image
              src={
                isRTL
                  ? "/logos/skinior-logo-black-ar.png"
                  : "/logos/skinior-logo-black.png"
              }
              alt="Skinior"
              width={140}
              height={36}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-10 flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 transition-all duration-200 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              <span
                className={`mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-600 ${
                  isRTL ? "ml-3 mr-0" : ""
                }`}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}

          {/* Language Switcher */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="px-4 py-2">
              <p
                className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "اللغة" : "Language"}
              </p>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </div>

      {/* User info */}
      <div className="flex-shrink-0 border-t border-gray-100 p-6">
        <div className="flex items-center p-3 rounded-2xl bg-gray-50/50">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className={`ml-3 flex-1 ${isRTL ? "mr-3 ml-0" : ""}`}>
            <p
              className={`text-sm font-semibold text-gray-900 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {user ? getUserDisplayName(user) : "Sarah Johnson"}
            </p>
            <button
              onClick={onLogout}
              className={`text-xs text-gray-500 hover:text-gray-700 transition-colors ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isRTL ? "تسجيل الخروج" : "Sign out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
