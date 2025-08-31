"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations, useLocale } from "next-intl";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const t = useTranslations("navbar");
  const locale = useLocale();

  const handleUserClick = () => {
    if (isAuthenticated) {
      // Could show a dropdown menu here
      router.push(`/${locale}/dashboard`);
      return;
    }
    router.push(`/${locale}/login`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push(`/${locale}`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push(`/${locale}`);
    }
  };

  const handleNewsClick = () => {
    router.push(`/${locale}/news`);
  };

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const currentPath = pathname.replace(/^\/(en|ar)/, "");
    router.push(`/${newLocale}${currentPath}`);
  };

  // Determine logo color based on current page
  const isLightBackground =
    pathname.includes("/login") ||
    pathname.includes("/news") ||
    pathname.includes("/privacy-policy") ||
    pathname.includes("/terms-of-service") ||
    pathname.includes("/cookie-policy") ||
    pathname.includes("/gdpr");
  const logoSrc = isLightBackground
    ? "/logo/skinior-logo-black.png"
    : "/logo/skinior-logo-white.png";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="cursor-pointer"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            aria-label="Go to home page"
          >
            <Image
              src={logoSrc}
              alt="Skinior Logo"
              width={120}
              height={30}
              className="h-6 sm:h-8 w-auto"
            />
          </div>
        </div>
        <div
          className={`flex items-center gap-2 sm:gap-4 ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          {isAuthenticated ? (
            <div
              className={`flex items-center gap-2 sm:gap-3 ${
                locale === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              {user && (
                <span className="text-xs sm:text-sm text-gray-100 font-medium hidden sm:inline">
                  Hi, {user.firstName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-medium py-1.5 px-3 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 cursor-pointer"
              onClick={handleUserClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleUserClick();
                }
              }}
              aria-label={t("login")}
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black"
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
          )}

          <button
            onClick={handleNewsClick}
            className="bg-white text-black font-medium py-1.5 px-3 sm:py-2 sm:px-6 rounded-full text-xs sm:text-sm hover:bg-gray-50 transition-all duration-300 shadow-md border border-gray-200 hover:shadow-lg hover:scale-105"
          >
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
              {t("news")}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="bg-white/20 backdrop-blur-sm text-white font-medium py-1.5 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm hover:bg-white/30 transition-all duration-300 border border-white/20 hover:border-white/40"
            title={t("language")}
          >
            <span className="text-xs sm:text-sm font-medium">
              {locale === "en" ? "العربية" : "English"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
