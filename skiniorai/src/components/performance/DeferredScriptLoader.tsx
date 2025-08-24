"use client";

import { useEffect } from "react";

/**
 * Component to defer loading of non-critical JavaScript
 * This helps reduce unused JavaScript and improves LCP/FCP
 */
export default function DeferredScriptLoader() {
  useEffect(() => {
    // Defer loading of non-critical scripts until after initial page load
    const deferScriptLoading = () => {
      // Load analytics scripts after initial page load
      if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
        // Defer Google Analytics
        const gaScript = document.createElement("script");
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`;
        gaScript.async = true;
        document.head.appendChild(gaScript);

        // Initialize gtag function
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: unknown[]) {
          window.dataLayer.push(args);
        }
        gtag("js", new Date());
        gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
      }
    };

    // Wait for page to be fully loaded before loading deferred scripts
    if (document.readyState === "complete") {
      setTimeout(deferScriptLoading, 1000); // Delay 1 second after load
    } else {
      window.addEventListener("load", () => {
        setTimeout(deferScriptLoading, 1000);
      });
    }
  }, []);

  return null;
}

// Type declarations for window.dataLayer
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
