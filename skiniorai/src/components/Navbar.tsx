"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserIcon,
  ArrowRightEndOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import LanguageSwitcher from "./LanguageSwitcher";
import CartIcon from "./cart/CartIcon";
import CartDrawer from "./cart/CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { getUserFullName } from "@/types/user";

const Navbar = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("navigation.shop"), href: "/shop" },
    { name: t("navigation.skinAnalysis"), href: "/skin-analysis" },
    { name: t("navigation.products"), href: "/products" },
    { name: t("navigation.routines"), href: "/routines" },
    { name: t("navigation.blog"), href: "/blog" },
    { name: t("navigation.about"), href: "/about" },
    ...(user ? [{ name: t("navigation.dashboard"), href: "/dashboard" }] : []),
  ];

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-3xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 hover:opacity-75 transition-opacity duration-200"
            >
              <Image
                src={"/logos/skinior-logo-black.png"}
                alt="Skinior"
                width={100}
                height={32}
                className="h-6 w-24 cursor-pointer"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div
              className={`flex items-center ${
                locale === "ar" ? "gap-6" : "gap-8"
              }`}
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-black/80 hover:text-black text-sm font-normal transition-colors duration-200 py-2 whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side actions - Desktop only */}
          <div
            className={`hidden lg:flex items-center ${
              locale === "ar" ? "gap-3" : "gap-4"
            }`}
          >
            <CartIcon variant="filled" size="md" />

            {/* Authentication buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/dashboard`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  <ChartBarIcon className="h-4 w-4" />
                  {t("navigation.dashboard")}
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <UserIcon className="h-4 w-4" />
                  <span>{getUserFullName(user)}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
                  {locale === "ar" ? "تسجيل خروج" : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/login`}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  {locale === "ar" ? "تسجيل دخول" : "Sign in"}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="bg-black text-white hover:bg-black/90 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  {locale === "ar" ? "إنشاء حساب" : "Sign up"}
                </Link>
              </div>
            )}

            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button - Mobile only */}
          <div className="flex lg:hidden items-center gap-3">
            <CartIcon variant="outline" size="sm" />
            <div className="block lg:hidden">
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              className="text-black/70 hover:text-black p-2 transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-current transition-all duration-200 ${
                    mobileMenuOpen ? "rotate-45 translate-y-0.5" : "mb-1"
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-current transition-all duration-200 ${
                    mobileMenuOpen ? "opacity-0" : "mb-1"
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-current transition-all duration-200 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-0.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="bg-white/98 backdrop-blur-3xl border-b border-gray-200/30">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-black/80 hover:text-black block px-4 py-3 text-base font-normal transition-colors duration-200 whitespace-nowrap"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Actions */}
              {user && (
                <div className="pt-2 border-t border-gray-200/50">
                  <Link
                    href={`/${locale}/dashboard`}
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 px-4 py-3 text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ChartBarIcon className="h-5 w-5" />
                    {t("navigation.dashboard")}
                  </Link>
                  <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600">
                    <UserIcon className="h-4 w-4" />
                    <span>{getUserFullName(user)}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900 px-4 py-3 text-base transition-colors w-full text-left"
                  >
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                    {locale === "ar" ? "تسجيل خروج" : "Logout"}
                  </button>
                </div>
              )}

              {/* Mobile CTA */}
              {!user && (
                <div className="pt-3 pb-1">
                  <button className="w-full bg-black text-white hover:bg-black/90 px-4 py-3 rounded-full text-base font-medium transition-colors duration-200">
                    {t("hero.cta")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </nav>
  );
};

export default Navbar;
