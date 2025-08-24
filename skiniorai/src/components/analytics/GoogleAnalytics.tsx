"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface GoogleAnalyticsProps {
  measurementId: string;
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", measurementId, {
        page_path: pathname,
      });
    }
  }, [pathname, measurementId]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  );
}

// Enhanced Analytics Hook with comprehensive tracking
export function useAnalytics() {
  const trackEvent = (
    eventName: string,
    parameters?: Record<string, unknown>
  ) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, {
        ...parameters,
        custom_parameter: true,
        timestamp: Date.now(),
        page_location: window.location.href,
        page_title: document.title,
      });

      // Console log for debugging (remove in production)
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Analytics Event:", eventName, parameters);
      }
    }
  };

  const trackPurchase = (
    transactionId: string,
    value: number,
    currency: string = "JOD",
    items: Array<{
      item_id: string;
      item_name: string;
      item_category: string;
      quantity: number;
      price: number;
    }>
  ) => {
    trackEvent("purchase", {
      transaction_id: transactionId,
      value,
      currency,
      items,
    });
  };

  const trackProductView = (
    productId: string,
    productName: string,
    price: number
  ) => {
    trackEvent("view_item", {
      currency: "JOD",
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
          quantity: 1,
        },
      ],
    });
  };

  const trackAddToCart = (
    productId: string,
    productName: string,
    price: number,
    quantity: number = 1
  ) => {
    trackEvent("add_to_cart", {
      currency: "JOD",
      value: price * quantity,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
          quantity: quantity,
        },
      ],
    });
  };

  const trackSearch = (searchTerm: string) => {
    trackEvent("search", {
      search_term: searchTerm,
    });
  };

  const trackSkinAnalysis = (analysisType: string) => {
    trackEvent("skin_analysis_start", {
      analysis_type: analysisType,
    });
  };

  // Conversion tracking methods
  const trackSignUp = (method: string = "email") => {
    trackEvent("sign_up", {
      method: method,
    });
  };

  const trackLogin = (method: string = "email") => {
    trackEvent("login", {
      method: method,
    });
  };

  const trackNewsletterSubscription = () => {
    trackEvent("newsletter_signup", {
      engagement_time_msec: Date.now(),
    });
  };

  const trackPageView = (pageName: string, pageCategory?: string) => {
    trackEvent("page_view", {
      page_name: pageName,
      page_category: pageCategory,
    });
  };

  const trackFormSubmission = (formName: string, success: boolean = true) => {
    trackEvent("form_submit", {
      form_name: formName,
      success: success,
    });
  };

  const trackFileDownload = (fileName: string, fileType: string) => {
    trackEvent("file_download", {
      file_name: fileName,
      file_type: fileType,
    });
  };

  const trackSocialShare = (platform: string, content: string) => {
    trackEvent("share", {
      method: platform,
      content_type: content,
    });
  };

  const trackErrorEvent = (errorMessage: string, errorCode?: string) => {
    trackEvent("exception", {
      description: errorMessage,
      fatal: false,
      error_code: errorCode,
    });
  };

  return {
    trackEvent,
    trackPurchase,
    trackProductView,
    trackAddToCart,
    trackSearch,
    trackSkinAnalysis,
    trackSignUp,
    trackLogin,
    trackNewsletterSubscription,
    trackPageView,
    trackFormSubmission,
    trackFileDownload,
    trackSocialShare,
    trackErrorEvent,
  };
}
