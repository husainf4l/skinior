"use client";

import CookieConsent from "react-cookie-consent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";

export default function PrivacyNoticePortal() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleAcceptAll = () => {
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
    router.push(`/${locale}${path}`);
  };

  if (!mounted) return null;

  return createPortal(
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Essential Only"
      enableDeclineButton
      cookieName="gdpr-consent"
      cookieValue="accepted"
      declineCookieValue="declined"
      expires={365}
      hideOnAccept={true}
      hideOnDecline={true}
      onAccept={handleAcceptAll}
      onDecline={handleEssentialOnly}
      sameSite="lax"
      containerClasses=""
      buttonClasses=""
      declineButtonClasses=""
      contentClasses=""
      ariaAcceptLabel="Accept all cookies"
      ariaDeclineLabel="Accept essential cookies only"
      style={{
        background: "white",
        color: "black",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        maxWidth: "512px",
        right: "16px",
        bottom: "16px",
        zIndex: 99999,
        position: "fixed",
        fontFamily: "inherit",
      }}
      buttonStyle={{
        background: "linear-gradient(to right, #000000, #374151)",
        color: "white",
        fontSize: "12px",
        fontWeight: "500",
        padding: "8px 12px",
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        marginLeft: "8px",
      }}
      declineButtonStyle={{
        background: "white",
        color: "black",
        fontSize: "12px",
        fontWeight: "500",
        padding: "8px 12px",
        borderRadius: "9999px",
        border: "1px solid #d1d5db",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        marginRight: "8px",
      }}
      contentStyle={{
        flex: "1",
        fontSize: "14px",
        lineHeight: "1.5",
        margin: "0",
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ flexShrink: 0 }}>
          <svg
            style={{ width: "24px", height: "24px", color: "black" }}
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
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
              margin: "0 0 8px 0",
            }}
          >
            GDPR Privacy Notice
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "12px",
              margin: "0 0 12px 0",
              lineHeight: "1.4",
            }}
          >
            We collect and process your personal data including Google
            authentication information and JWT tokens for secure access. This
            includes essential data for app functionality and optional analytics
            to improve our service.
          </p>
          <div
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginBottom: "16px",
              margin: "0 0 16px 0",
            }}
          >
            <strong>Essential processing:</strong> Google OAuth, JWT
            authentication, account security
            <br />
            <strong>Optional:</strong> Usage analytics, personalized features
          </div>
          <div style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
            <button
              onClick={() => handleLearnMore("/privacy-policy")}
              style={{
                color: "#6b7280",
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                padding: "0",
              }}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLearnMore("/gdpr")}
              style={{
                color: "#6b7280",
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                padding: "0",
              }}
            >
              GDPR Rights
            </button>
          </div>
        </div>
      </div>
    </CookieConsent>,
    document.body
  );
}
