"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: {
        page_path?: string;
        page_title?: string;
        page_location?: string;
        send_to?: string;
        [key: string]: string | number | boolean | undefined;
      }
    ) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    // Don't load GA if measurement ID is not provided
    if (!measurementId) {
      console.warn(
        "Google Analytics measurement ID not found. Please add NEXT_PUBLIC_GA_MEASUREMENT_ID to your environment variables."
      );
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);

    // Track page views
    const handleRouteChange = (url: string) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", measurementId, {
          page_path: url,
        });
      }
    };

    handleRouteChange(pathname);

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll(
        'script[src*="googletagmanager"]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, [pathname]);

  return null;
}
