"use client";

import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
  loadTime?: number;
}

export default function PerformanceTracker() {
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Thresholds for Core Web Vitals (Google's recommended values)
    const THRESHOLDS = {
      FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
      LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
      FID: { good: 100, poor: 300 }, // First Input Delay
      CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
      TTFB: { good: 800, poor: 1800 }, // Time to First Byte
    };

    const getRating = (
      value: number,
      thresholds: { good: number; poor: number }
    ) => {
      if (value <= thresholds.good) return "good";
      if (value <= thresholds.poor) return "needs-improvement";
      return "poor";
    };

    // Enhanced Core Web Vitals measurement
    const measureWebVitals = () => {
      // First Contentful Paint (FCP)
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            const fcp = entry.startTime;
            const rating = getRating(fcp, THRESHOLDS.FCP);

            metricsRef.current.FCP = fcp;
            console.log(`🎨 FCP: ${fcp.toFixed(2)}ms (${rating})`);

            // Send to analytics with rating
            if (window.gtag) {
              window.gtag("event", "web_vitals", {
                metric_name: "FCP",
                metric_value: Math.round(fcp),
                metric_rating: rating,
                metric_delta: Math.round(fcp),
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ["paint"] });
    };

    // Largest Contentful Paint (LCP)
    const measureLCP = () => {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        const rating = getRating(lcp, THRESHOLDS.LCP);

        metricsRef.current.LCP = lcp;
        console.log(`🖼️ LCP: ${lcp.toFixed(2)}ms (${rating})`);

        if (window.gtag) {
          window.gtag("event", "web_vitals", {
            metric_name: "LCP",
            metric_value: Math.round(lcp),
            metric_rating: rating,
            metric_delta: Math.round(lcp),
          });
        }
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    };

    // Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      let clsValue = 0;
      const clsEntries: PerformanceEntry[] = [];

      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Only count layout shifts without recent user input
          if (
            !(entry as PerformanceEntry & { hadRecentInput?: boolean })
              .hadRecentInput
          ) {
            clsEntries.push(entry);
            clsValue += (entry as PerformanceEntry & { value: number }).value;
          }
        }

        const rating = getRating(clsValue, THRESHOLDS.CLS);
        metricsRef.current.CLS = clsValue;
        console.log(`📐 CLS: ${clsValue.toFixed(4)} (${rating})`);

        if (window.gtag) {
          window.gtag("event", "web_vitals", {
            metric_name: "CLS",
            metric_value: Math.round(clsValue * 10000) / 10000,
            metric_rating: rating,
            metric_delta: Math.round(clsValue * 10000) / 10000,
          });
        }
      });

      observer.observe({ entryTypes: ["layout-shift"] });
    };

    // Time to First Byte (TTFB)
    const measureTTFB = () => {
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb =
          navigationEntry.responseStart - navigationEntry.requestStart;
        metricsRef.current.TTFB = ttfb;
        console.log("TTFB:", ttfb);

        if (window.gtag) {
          window.gtag("event", "web_vitals", {
            custom_parameter_name: "TTFB",
            custom_parameter_value: Math.round(ttfb),
          });
        }
      }
    };

    // Page Load Time
    const measureLoadTime = () => {
      window.addEventListener("load", () => {
        const loadTime = performance.now();
        metricsRef.current.loadTime = loadTime;
        console.log("Load Time:", loadTime);

        if (window.gtag) {
          window.gtag("event", "page_load_time", {
            value: Math.round(loadTime),
          });
        }
      });
    };

    // Initialize measurements
    measureWebVitals();
    measureLCP();
    measureCLS();
    measureTTFB();
    measureLoadTime();

    // Send comprehensive report after page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        const report = {
          url: window.location.href,
          userAgent: navigator.userAgent,
          connectionType:
            (
              navigator as Navigator & {
                connection?: { effectiveType?: string };
              }
            ).connection?.effectiveType || "unknown",
          metrics: metricsRef.current,
          timestamp: new Date().toISOString(),
        };

        console.log("Performance Report:", report);

        // Send to your analytics service
        if (window.gtag) {
          window.gtag("event", "performance_report", {
            custom_parameter_metrics: JSON.stringify(metricsRef.current),
          });
        }
      }, 1000);
    });

    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return null; // This is a tracking component, no UI
}

// Hook for manual performance tracking
export function usePerformanceTracking() {
  const trackCustomMetric = (
    name: string,
    value: number,
    unit: string = "ms"
  ) => {
    console.log(`Custom Metric - ${name}: ${value}${unit}`);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "custom_metric", {
        custom_parameter_name: name,
        custom_parameter_value: value,
        custom_parameter_unit: unit,
      });
    }
  };

  const trackResourceTiming = (resourceName: string) => {
    const resources = performance.getEntriesByName(resourceName);
    if (resources.length > 0) {
      const resource = resources[0];
      trackCustomMetric(`${resourceName}_load_time`, resource.duration);
    }
  };

  const markFeatureUsage = (feature: string) => {
    performance.mark(`feature_${feature}_used`);
    console.log(`Feature used: ${feature}`);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "feature_usage", {
        feature_name: feature,
      });
    }
  };

  return {
    trackCustomMetric,
    trackResourceTiming,
    markFeatureUsage,
  };
}
