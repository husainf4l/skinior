"use client";

import { useEffect } from "react";

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    // Monitor Largest Contentful Paint (LCP)
    this.observeLCP();

    // Monitor First Input Delay (FID)
    this.observeFID();

    // Monitor Cumulative Layout Shift (CLS)
    this.observeCLS();

    // Monitor First Contentful Paint (FCP)
    this.observeFCP();

    // Monitor Time to First Byte (TTFB)
    this.observeTTFB();
  }

  private observeLCP() {
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        this.metrics.lcp =
          lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
        this.reportMetric("LCP", this.metrics.lcp);
      }).observe({ entryTypes: ["largest-contentful-paint"] });
    } catch {
      console.warn("LCP monitoring not supported");
    }
  }

  private observeFID() {
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & {
            processingStart?: number;
          };
          this.metrics.fid = fidEntry.processingStart
            ? fidEntry.processingStart - entry.startTime
            : entry.duration;
          this.reportMetric("FID", this.metrics.fid);
        });
      }).observe({ entryTypes: ["first-input"] });
    } catch {
      console.warn("FID monitoring not supported");
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
          }
        });
        this.metrics.cls = clsValue;
        this.reportMetric("CLS", this.metrics.cls);
      }).observe({ entryTypes: ["layout-shift"] });
    } catch {
      console.warn("CLS monitoring not supported");
    }
  }

  private observeFCP() {
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          this.metrics.fcp = entry.startTime;
          this.reportMetric("FCP", this.metrics.fcp);
        });
      }).observe({ entryTypes: ["paint"] });
    } catch {
      console.warn("FCP monitoring not supported");
    }
  }

  private observeTTFB() {
    try {
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.metrics.ttfb =
          navigationEntry.responseStart - navigationEntry.requestStart;
        this.reportMetric("TTFB", this.metrics.ttfb);
      }
    } catch {
      console.warn("TTFB monitoring not supported");
    }
  }

  private reportMetric(name: string, value: number) {
    if (process.env.NODE_ENV === "development") {
      console.log(`Performance Metric - ${name}:`, value);
    }

    // Send to analytics if in production
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined" &&
      window.gtag
    ) {
      window.gtag("event", "web_vitals", {
        event_category: "performance",
        event_label: name,
        value: Math.round(value),
        non_interaction: true,
      });
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

const PerformanceMonitorComponent = () => {
  useEffect(() => {
    const monitor = new PerformanceMonitor();

    // Report final metrics when page is about to unload
    const handleBeforeUnload = () => {
      const metrics = monitor.getMetrics();
      if (process.env.NODE_ENV === "development") {
        console.log("Final Performance Metrics:", metrics);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitorComponent;
