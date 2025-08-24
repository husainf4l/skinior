"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "./GoogleAnalytics";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: Array<{ path: string; views: number }>;
  deviceTypes: Array<{ device: string; percentage: number }>;
  conversions: Array<{ event: string; count: number }>;
}

interface PerformanceMetrics {
  FCP?: number;
  LCP?: number;
  CLS?: number;
  FID?: number;
  TTFB?: number;
}

export default function AnalyticsDashboard() {
  const analytics = useAnalytics();

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: "0:00",
    topPages: [],
    deviceTypes: [],
    conversions: [],
  });

  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    // Simulate loading analytics data
    // In production, you would fetch this from your analytics API
    setTimeout(() => {
      setAnalyticsData({
        pageViews: 12547,
        uniqueVisitors: 8932,
        bounceRate: 23.5,
        avgSessionDuration: "2:34",
        topPages: [
          { path: "/", views: 4532 },
          { path: "/shop", views: 2891 },
          { path: "/skin-analysis", views: 2156 },
          { path: "/products", views: 1743 },
          { path: "/blog", views: 1225 },
        ],
        deviceTypes: [
          { device: "Mobile", percentage: 67.2 },
          { device: "Desktop", percentage: 28.5 },
          { device: "Tablet", percentage: 4.3 },
        ],
        conversions: [
          { event: "Skin Analysis Started", count: 324 },
          { event: "Product Added to Cart", count: 189 },
          { event: "Newsletter Signup", count: 156 },
          { event: "Purchase Completed", count: 87 },
        ],
      });

      // Simulate performance metrics
      setPerformanceMetrics({
        FCP: 1200,
        LCP: 2100,
        CLS: 0.08,
        FID: 45,
        TTFB: 650,
      });

      setIsLoading(false);
    }, 1500);
  }, [timeRange]);

  const getPerformanceRating = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return "unknown";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "text-green-600 bg-green-100";
      case "needs-improvement":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-600 mb-1">Page Views</h3>
          <p className="text-2xl font-bold text-blue-900">
            {analyticsData.pageViews.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-600 mb-1">
            Unique Visitors
          </h3>
          <p className="text-2xl font-bold text-green-900">
            {analyticsData.uniqueVisitors.toLocaleString()}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-600 mb-1">
            Bounce Rate
          </h3>
          <p className="text-2xl font-bold text-yellow-900">
            {analyticsData.bounceRate}%
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-600 mb-1">
            Avg. Session
          </h3>
          <p className="text-2xl font-bold text-purple-900">
            {analyticsData.avgSessionDuration}
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Core Web Vitals
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(performanceMetrics).map(([metric, value]) => {
            if (value === undefined) return null;
            const rating = getPerformanceRating(metric, value);
            const colorClass = getRatingColor(rating);

            return (
              <div
                key={metric}
                className="text-center p-3 border border-gray-200 rounded-lg"
              >
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {metric}
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {metric === "CLS"
                    ? value.toFixed(3)
                    : `${Math.round(value)}ms`}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
                  {rating.replace("-", " ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Pages
          </h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                  {page.path}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {page.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Types */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Device Types
          </h3>
          <div className="space-y-3">
            {analyticsData.deviceTypes.map((device, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{device.device}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversions */}
      <div className="mt-6 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Conversions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData.conversions.map((conversion, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">
                {conversion.event}
              </div>
              <div className="text-xl font-bold text-gray-900">
                {conversion.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            const data = { analyticsData, performanceMetrics };
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `skinior-analytics-${
              new Date().toISOString().split("T")[0]
            }.json`;
            a.click();
            URL.revokeObjectURL(url);

            // Track export event
            analytics.trackEvent("export_analytics", { format: "json" });
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export Data
        </button>
      </div>
    </div>
  );
}
