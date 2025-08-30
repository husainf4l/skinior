"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PrivacyNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if user has already given consent
    const consent = localStorage.getItem("gdpr-consent");
    if (!consent) {
      // Show privacy notice after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setIsVisible(false);
    // Store comprehensive consent in localStorage
    const consentData = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    localStorage.setItem("gdpr-consent", JSON.stringify(consentData));
  };

  const handleEssentialOnly = () => {
    setIsVisible(false);
    // Store minimal consent for essential features only
    const consentData = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    localStorage.setItem("gdpr-consent", JSON.stringify(consentData));
  };

  const handleLearnMore = (path: string) => {
    router.push(path);
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  const privacyBanner = (
    <div
      id="privacy-notice-root"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-lg pointer-events-auto"
      style={{ zIndex: 2147483648, position: "fixed" }} // ensure banner sits above portal/container and other elements
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              GDPR Privacy Notice
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              We collect and process your personal data including Google
              authentication information and JWT tokens for secure access. This
              includes essential data for app functionality and optional
              analytics to improve our service.
            </p>
            <div className="text-xs text-gray-500 mb-4">
              <strong>Essential processing:</strong> Google OAuth, JWT
              authentication, account security
              <br />
              <strong>Optional:</strong> Usage analytics, personalized features
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-gradient-to-r from-black to-gray-800 text-white text-xs font-medium py-2 px-3 rounded-full hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  Accept All
                </button>
                <button
                  onClick={handleEssentialOnly}
                  className="flex-1 bg-white text-black text-xs font-medium py-2 px-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform"
                >
                  Essential Only
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLearnMore("/privacy-policy")}
                  className="flex-1 bg-gray-50 text-gray-700 text-xs font-medium py-2 px-3 rounded-full hover:bg-gray-100 transition-all duration-300"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => handleLearnMore("/gdpr")}
                  className="flex-1 bg-gray-50 text-gray-700 text-xs font-medium py-2 px-3 rounded-full hover:bg-gray-100 transition-all duration-300"
                >
                  GDPR Rights
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-all duration-300"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return privacyBanner;
};

export default PrivacyNotice;
