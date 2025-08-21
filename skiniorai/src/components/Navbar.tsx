"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: t("navigation.shop"), href: "/shop" },
    { name: t("navigation.skinAnalysis"), href: "/skin-analysis" },
    { name: t("navigation.products"), href: "/products" },
    { name: t("navigation.routines"), href: "/routines" },
  ];

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen((prev) => !prev);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 hover:opacity-75 transition-opacity duration-200"
            >
              <Image
                src={locale === "ar" ? "/logos/skinior-logo-black-ar.png" : "/logos/skinior-logo-black.png"}
                alt="Skinior"
                width={90}
                height={28}
                className="h-5 w-auto cursor-pointer"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 text-sm font-normal tracking-tight transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="hidden lg:block relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-full p-1 hover:bg-gray-50"
                >
                  <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {getUserFullName(user).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href={`/${locale}/dashboard`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t("navigation.dashboard")}
                    </Link>
                    <div className="px-4 py-2">
                      <div className="text-xs text-gray-500 mb-2">{locale === "ar" ? "اللغة" : "Language"}</div>
                      <LanguageSwitcher />
                    </div>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {locale === "ar" ? "تسجيل الخروج" : "Sign out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <LanguageSwitcher />
                <Link
                  href={`/${locale}/login`}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  {locale === "ar" ? "دخول" : "Sign in"}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {locale === "ar" ? "إنشاء حساب" : "Sign up"}
                </Link>
              </div>
            )}

            {/* Cart Icon - Always visible */}
            <div className="hidden lg:block">
              <CartIcon variant="outline" size="sm" />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              <CartIcon variant="outline" size="sm" />
              <LanguageSwitcher />
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 p-2 transition-colors"
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
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="bg-white border-t border-gray-100">
            <div className="px-6 py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-gray-900 py-2 text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <Link
                    href={`/${locale}/dashboard`}
                    className="block text-gray-600 hover:text-gray-900 py-2 text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("navigation.dashboard")}
                  </Link>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {getUserFullName(user).charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{getUserFullName(user)}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                    >
                      {locale === "ar" ? "خروج" : "Logout"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <Link
                    href={`/${locale}/login`}
                    className="block text-gray-600 hover:text-gray-900 py-2 text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {locale === "ar" ? "دخول" : "Sign in"}
                  </Link>
                  <Link
                    href={`/${locale}/signup`}
                    className="block bg-gray-900 text-white hover:bg-gray-800 px-4 py-3 rounded-full text-base font-medium transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {locale === "ar" ? "إنشاء حساب" : "Sign up"}
                  </Link>
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