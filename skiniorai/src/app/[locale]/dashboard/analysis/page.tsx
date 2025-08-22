"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function AnalysisPage() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  const analyses = [
    {
      id: "analysis-001",
      date: "2024-01-15",
      type: "Complete Analysis",
      duration: "15 minutes",
      skinType: "Combination",
      concerns: ["Acne", "Large Pores", "Blackheads"],
      score: 78,
      improvements: [
        { aspect: "Hydration", score: 85, change: "+5" },
        { aspect: "Texture", score: 72, change: "-3" },
        { aspect: "Clarity", score: 80, change: "+8" },
        { aspect: "Tone", score: 75, change: "+2" },
      ],
      recommendations: [
        "Use a gentle salicylic acid cleanser twice daily",
        "Apply niacinamide serum to reduce pore appearance",
        "Incorporate retinol treatment 2-3 times per week",
        "Always use SPF 30+ sunscreen during the day",
      ],
      images: [
        { type: "Before", url: "/placeholder-face.jpg" },
        { type: "UV Analysis", url: "/placeholder-uv.jpg" },
        { type: "Pore Analysis", url: "/placeholder-pore.jpg" },
      ],
    },
    {
      id: "analysis-002",
      date: "2024-01-08",
      type: "Quick Check",
      duration: "5 minutes",
      skinType: "Combination",
      concerns: ["Blackheads", "Oiliness"],
      score: 82,
      improvements: [
        { aspect: "Hydration", score: 80, change: "-5" },
        { aspect: "Texture", score: 75, change: "+3" },
        { aspect: "Clarity", score: 72, change: "-8" },
        { aspect: "Tone", score: 73, change: "-2" },
      ],
      recommendations: [
        "Continue with current cleansing routine",
        "Add a clay mask once weekly",
        "Consider oil-free moisturizer",
      ],
      images: [{ type: "Before", url: "/placeholder-face.jpg" }],
    },
    {
      id: "analysis-003",
      date: "2024-01-01",
      type: "Complete Analysis",
      duration: "15 minutes",
      skinType: "Combination",
      concerns: ["Acne", "Hyperpigmentation"],
      score: 70,
      improvements: [
        { aspect: "Hydration", score: 85, change: "+0" },
        { aspect: "Texture", score: 69, change: "+0" },
        { aspect: "Clarity", score: 64, change: "+0" },
        { aspect: "Tone", score: 71, change: "+0" },
      ],
      recommendations: [
        "Establish consistent morning and evening routine",
        "Start with gentle products to avoid irritation",
        "Focus on hydration and sun protection",
        "Consider professional consultation",
      ],
      images: [
        { type: "Before", url: "/placeholder-face.jpg" },
        { type: "UV Analysis", url: "/placeholder-uv.jpg" },
        { type: "Pigmentation Analysis", url: "/placeholder-pigment.jpg" },
      ],
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return isRTL ? "ممتاز" : "Excellent";
    if (score >= 70) return isRTL ? "جيد" : "Good";
    return isRTL ? "يحتاج عناية" : "Needs Care";
  };

  const getChangeIcon = (change: string) => {
    if (change.startsWith("+")) {
      return (
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
      );
    } else if (change.startsWith("-")) {
      return (
        <svg
          className="w-4 h-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 13l-5 5m0 0l-5-5m5 5V6"
          />
        </svg>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  return (
    <DashboardLayout>
      <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl font-semibold text-gray-900 mb-3 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "تحليلات البشرة" : "Skin Analysis History"}
              </h1>
              <p
                className={`text-lg text-gray-600 ${isRTL ? "font-cairo" : ""}`}
              >
                {isRTL
                  ? "تتبع تقدم بشرتك عبر الزمن"
                  : "Track your skin progress over time"}
              </p>
            </div>
            <Link
              href={`/${locale}/room-test`}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isRTL ? "تحليل جديد" : "New Analysis"}
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-gray-900 mb-2">
                  {analyses.length}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "إجمالي التحليلات" : "Total Analyses"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-green-600 mb-2">
                  {Math.round(
                    analyses.reduce((sum, a) => sum + a.score, 0) /
                      analyses.length
                  )}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "متوسط النقاط" : "Average Score"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-blue-600 mb-2">
                  {analyses[0]?.score > analyses[analyses.length - 1]?.score
                    ? "+"
                    : ""}
                  {analyses[0]?.score - analyses[analyses.length - 1]?.score ||
                    0}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "التحسن منذ البداية" : "Improvement Since Start"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-600 mb-2">
                  {
                    analyses.filter((a) => a.type === "Complete Analysis")
                      .length
                  }
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "تحليلات شاملة" : "Complete Analyses"}
                </p>
              </div>
            </div>
          </div>

          {/* Analysis List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                  selectedAnalysis === analysis.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() =>
                  setSelectedAnalysis(
                    selectedAnalysis === analysis.id ? null : analysis.id
                  )
                }
              >
                {/* Analysis Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className={`text-lg font-semibold text-gray-900 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {analysis.type}
                      </h3>
                      <p
                        className={`text-sm text-gray-600 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {formatDate(analysis.date)} • {analysis.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span
                          className={`text-2xl font-bold ${getScoreColor(
                            analysis.score
                          )}`}
                        >
                          {analysis.score}
                        </span>
                        <span className="text-gray-500">/100</span>
                      </div>
                      <p
                        className={`text-xs ${getScoreColor(analysis.score)} ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {getScoreLabel(analysis.score)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <span
                      className={`text-sm text-gray-600 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {isRTL ? "نوع البشرة: " : "Skin Type: "}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {analysis.skinType}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {analysis.concerns.map((concern, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Analysis Details - Collapsible */}
                {selectedAnalysis === analysis.id && (
                  <div className="p-6 space-y-6">
                    {/* Skin Metrics */}
                    <div>
                      <h4
                        className={`text-md font-semibold text-gray-900 mb-4 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "مقاييس البشرة" : "Skin Metrics"}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {analysis.improvements.map((metric, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-sm font-medium text-gray-700 ${
                                  isRTL ? "font-cairo" : ""
                                }`}
                              >
                                {metric.aspect}
                              </span>
                              <div className="flex items-center space-x-1">
                                {getChangeIcon(metric.change)}
                                <span
                                  className={`text-xs ${
                                    metric.change.startsWith("+")
                                      ? "text-green-600"
                                      : metric.change.startsWith("-")
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {metric.change}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${metric.score}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {metric.score}/100
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analysis Images */}
                    {analysis.images && analysis.images.length > 0 && (
                      <div>
                        <h4
                          className={`text-md font-semibold text-gray-900 mb-4 ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {isRTL ? "صور التحليل" : "Analysis Images"}
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          {analysis.images.map((image, i) => (
                            <div
                              key={i}
                              className="bg-gray-100 rounded-xl p-4 text-center"
                            >
                              <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <p
                                className={`text-xs text-gray-600 ${
                                  isRTL ? "font-cairo" : ""
                                }`}
                              >
                                {image.type}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <h4
                        className={`text-md font-semibold text-gray-900 mb-4 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "التوصيات" : "Recommendations"}
                      </h4>
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, i) => (
                          <div
                            key={i}
                            className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl"
                          >
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-blue-600">
                                {i + 1}
                              </span>
                            </div>
                            <p
                              className={`text-sm text-gray-700 ${
                                isRTL ? "font-cairo" : ""
                              }`}
                            >
                              {rec}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Chart Placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3
              className={`text-lg font-semibold text-gray-900 mb-6 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isRTL ? "تقدم البشرة عبر الزمن" : "Skin Progress Over Time"}
            </h3>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className={`text-gray-500 ${isRTL ? "font-cairo" : ""}`}>
                  {isRTL
                    ? "رسم بياني لتقدم البشرة"
                    : "Interactive progress chart coming soon"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
