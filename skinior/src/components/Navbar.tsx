"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const handleUserClick = () => {
    if (isAuthenticated) {
      // Could show a dropdown menu here
      router.push("/dashboard");
      return;
    }
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleNewsClick = () => {
    router.push("/news");
  };

  // Determine logo color based on current page
  const isLightBackground =
    pathname === "/login" ||
    pathname === "/news" ||
    pathname.startsWith("/news/") ||
    pathname === "/privacy-policy" ||
    pathname === "/terms-of-service" ||
    pathname === "/cookie-policy" ||
    pathname === "/gdpr";
  const logoSrc = isLightBackground
    ? "/logo/skinior-logo-black.png"
    : "/logo/skinior-logo-white.png";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
              className="h-8 w-auto"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={handleNewsClick}
            className="bg-white text-black font-medium py-2 px-6 rounded-full text-sm hover:bg-gray-50 transition-all duration-300 shadow-md border border-gray-200 hover:shadow-lg hover:scale-105"
          >
            <span className="text-sm font-medium bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
              News
            </span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {user && (
                <span className="text-sm text-gray-700 font-medium">
                  Hi, {user.firstName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-medium py-2 px-4 rounded-full text-sm hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <div
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 cursor-pointer"
              onClick={handleUserClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleUserClick();
                }
              }}
              aria-label="Go to login page"
            >
              <svg
                className="w-4 h-4 text-black"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
