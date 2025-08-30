"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Footer = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          {/* Logo and Description */}
          <div className="max-w-sm">
            <Image
              src="/logo/skinior-logo-black.png"
              alt="Skinior"
              width={80}
              height={20}
              className="h-5 w-auto mb-6"
              priority={false}
            />
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              The world&apos;s first agentic skincare platform that learns your skin,
              adapts your routine, and evolves with your needs.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-12">
            {/* Product Links */}
            <div className="space-y-3">
              <button
                onClick={() => handleNavigation("/")}
                className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation("/news")}
                className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                News
              </button>
              <button className="block text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </button>
            </div>

            {/* Legal Links */}
            <div className="space-y-3">
              <button
                onClick={() => handleNavigation("/privacy-policy")}
                className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handleNavigation("/terms-of-service")}
                className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => handleNavigation("/gdpr")}
                className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                GDPR
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs text-gray-500">
              © 2025 Roxate Ltd. All rights reserved.
            </div>
            <div className="text-xs text-gray-400">
              Company No. 16232608 · England & Wales
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
