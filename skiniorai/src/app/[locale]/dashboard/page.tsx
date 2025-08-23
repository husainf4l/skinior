"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useDashboardOverview } from "@/hooks/useDashboard";
import {
  DashboardSkeleton,
  // StatCardSkeleton,  // Unused import
  ErrorState,
  EmptyState,
} from "@/components/dashboard/DashboardSkeleton";

export default function DashboardPage() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedRange, setSelectedRange] = useState<"7d" | "30d" | "90d">(
    "7d"
  );
  const [showApiTest, setShowApiTest] = useState(false);

  const {
    data: dashboardData,
    loading,
    error,
    refetch,
  } = useDashboardOverview(selectedRange);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display (currently unused)
  // const formatTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleTimeString(locale === "ar" ? "ar-SA" : "en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
          <div className="max-w-7xl mx-auto">
            <DashboardSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
          <div className="max-w-7xl mx-auto">
            <ErrorState
              message={
                error === "UNAUTHORIZED"
                  ? "Please log in to access your dashboard"
                  : error
              }
              onRetry={refetch}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
          <div className="max-w-7xl mx-auto">
            <EmptyState
              title="No Dashboard Data"
              description="Unable to load dashboard information"
              actionLabel="Retry"
              onAction={refetch}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const {
    personalStats,
    myActiveTreatments,
    myRecentConsultations,
    // recommendedProductsCount,  // Currently unused
    // favoritesCount,             // Currently unused
    // myCollectionValue,          // Currently unused
  } = dashboardData;

  // Map the API response to the expected structure
  const aiStats = {
    totalConsultations: personalStats?.myConsultations || 0,
    activeTreatments: personalStats?.myActiveTreatments || 0,
    successRate: personalStats?.skinImprovementRate || 0,
    avgImprovement: personalStats?.avgImprovementScore || 0,
  };

  const activeTreatments = myActiveTreatments || [];
  const recentConsultations = myRecentConsultations || [];

  return (
    <DashboardLayout>
      <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Debug/API Test Section - Only show in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-yellow-800">
                    Development Mode
                  </span>
                </div>
                <button
                  onClick={() => setShowApiTest(!showApiTest)}
                  className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  {showApiTest ? "Hide API Test" : "Show API Test"}
                </button>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1
                  className={`text-4xl font-semibold text-gray-900 mb-3 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "مرحباً بك" : "Good morning"}
                </h1>
                <p
                  className={`text-lg text-gray-600 mb-4 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL
                    ? "مستشارك الذكي للجمال يتابع تقدمك"
                    : "Your AI Beauty Advisor is tracking your progress"}
                </p>

                {/* Range Selector */}
                <div className="flex items-center space-x-2 mb-4">
                  {(["7d", "30d", "90d"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedRange(range)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedRange === range
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {range === "7d"
                        ? isRTL
                          ? "آخر 7 أيام"
                          : "Last 7 Days"
                        : range === "30d"
                        ? isRTL
                          ? "آخر 30 يوم"
                          : "Last 30 Days"
                        : isRTL
                        ? "آخر 90 يوم"
                        : "Last 90 Days"}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span
                      className={`text-sm text-gray-700 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {isRTL
                        ? "متاح للاستشارة الآن"
                        : "Available for consultation"}
                    </span>
                  </div>

                  {/* API Status Indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600">
                      {isRTL ? "متصل بالخادم" : "API Connected"}
                    </span>
                  </div>

                  {/* Data refresh indicator */}
                  <button
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                  >
                    <svg
                      className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>
                      {loading
                        ? isRTL
                          ? "جاري التحديث..."
                          : "Refreshing..."
                        : isRTL
                        ? "تحديث"
                        : "Refresh"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisor Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "الاستشارات الكاملة" : "Total Consultations"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {aiStats.totalConsultations}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {aiStats.totalConsultations === 0
                      ? isRTL
                        ? "لم تبدأ بعد"
                        : "Getting started"
                      : `+${Math.round(
                          aiStats.totalConsultations * 0.25
                        )} this month`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "الخطط النشطة" : "Active Treatments"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {aiStats.activeTreatments}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {aiStats.activeTreatments === 0
                      ? isRTL
                        ? "جاهز للبدء"
                        : "Ready to start"
                      : isRTL
                      ? "قيد التشغيل"
                      : "On track"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "معدل النجاح" : "Success Rate"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {aiStats.successRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {aiStats.successRate === 0
                      ? isRTL
                        ? "سيتم حسابه قريباً"
                        : "Will calculate soon"
                      : aiStats.successRate >= 85
                      ? isRTL
                        ? "أعلى من المتوسط"
                        : "Above average"
                      : isRTL
                      ? "جيد"
                      : "Good progress"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "متوسط التحسن" : "Avg Improvement"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {aiStats.avgImprovement}%
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Faster than usual
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Consultations & Active Treatments */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent AI Consultations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-xl font-semibold text-gray-900 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {isRTL
                        ? "الاستشارات الأخيرة مع الذكاء الاصطناعي"
                        : "Recent AI Consultations"}
                    </h2>
                    <Link
                      href={`/${locale}/room`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                      {isRTL ? "استشارة جديدة" : "New Consultation"}
                    </Link>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {recentConsultations && recentConsultations.length > 0 ? (
                    recentConsultations.map((consultation) => (
                      <div
                        key={consultation.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {consultation.analysisType ||
                                "AI Beauty Analysis"}
                            </p>
                            <p className="text-sm text-purple-600">
                              {formatDate(consultation.createdAt)}
                            </p>
                            <p className="text-xs text-gray-600">
                              {consultation.concerns?.join(", ") ||
                                "General consultation"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              consultation.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {consultation.status === "completed"
                              ? isRTL
                                ? "مكتملة"
                                : "Completed"
                              : isRTL
                              ? "جارية"
                              : "In Progress"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {isRTL ? "مستشار ذكي" : "AI Advisor"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title={
                        isRTL ? "لا توجد استشارات بعد" : "No Consultations Yet"
                      }
                      description={
                        isRTL
                          ? "ابدأ محادثة مع مستشارك الذكي للجمال"
                          : "Start chatting with your AI Beauty Advisor"
                      }
                      className="py-8"
                    />
                  )}

                  <Link
                    href={`/${locale}/room`}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                  >
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p
                        className={`text-sm font-medium text-gray-600 group-hover:text-purple-600 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL
                          ? "بدء استشارة جديدة"
                          : "Start New AI Consultation"}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Active Treatment Plans */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-xl font-semibold text-gray-900 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {isRTL ? "خطط العلاج النشطة" : "Active Treatment Plans"}
                    </h2>
                    <Link
                      href={`/${locale}/dashboard/treatments`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                      {isRTL ? "عرض الكل" : "View All"}
                    </Link>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {activeTreatments && activeTreatments.length > 0 ? (
                    activeTreatments.map((treatment) => (
                      <div
                        key={treatment.id}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">
                            {treatment.name}
                          </h4>
                          <span className="text-sm text-green-600 font-medium">
                            {treatment.progress}% Complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${treatment.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>
                            {treatment.currentWeek
                              ? `Week ${treatment.currentWeek}`
                              : "Ongoing"}{" "}
                            • Started{" "}
                            {treatment.startDate
                              ? formatDate(treatment.startDate)
                              : "Recently"}
                          </span>
                          <span className="text-blue-600 font-medium">
                            {treatment.nextMilestone || "In Progress"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title={
                        isRTL ? "لا توجد خطط علاج نشطة" : "No Active Treatments"
                      }
                      description={
                        isRTL
                          ? "لم يتم إنشاء أي خطط علاج بعد"
                          : "You don't have any active treatment plans yet"
                      }
                      className="py-8"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* AI Advisor Actions & Consultation History */}
            <div className="space-y-6">
              {/* AI Advisor Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3
                  className={`text-lg font-semibold text-gray-900 mb-4 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "مستشار الجمال الذكي" : "AI Beauty Advisor"}
                </h3>
                <div className="space-y-3">
                  <Link
                    href={`/${locale}/room`}
                    className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors group border border-blue-100"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? "mr-3 ml-0" : ""}`}>
                      <p
                        className={`font-medium text-gray-900 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "استشارة فورية" : "Instant Consultation"}
                      </p>
                      <p
                        className={`text-xs text-gray-600 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "متاح الآن" : "Available now"}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/${locale}/skin-analysis`}
                    className="flex items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? "mr-3 ml-0" : ""}`}>
                      <p
                        className={`font-medium text-gray-900 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "تحليل البشرة" : "Skin Analysis"}
                      </p>
                      <p
                        className={`text-xs text-gray-600 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL
                          ? "تحليل بالذكاء الاصطناعي"
                          : "AI-powered analysis"}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/${locale}/dashboard/treatments`}
                    className="flex items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? "mr-3 ml-0" : ""}`}>
                      <p
                        className={`font-medium text-gray-900 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "عرض الخطط" : "View Treatment Plans"}
                      </p>
                      <p
                        className={`text-xs text-gray-600 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "خطط مخصصة" : "Personalized plans"}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Consultations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-lg font-semibold text-gray-900 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "الاستشارات الأخيرة" : "Recent Consultations"}
                  </h3>
                  <Link
                    href={`/${locale}/dashboard/consultations`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    {isRTL ? "عرض الكل" : "View All"}
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentConsultations && recentConsultations.length > 0 ? (
                    recentConsultations.map((consultation) => (
                      <div
                        key={consultation.id}
                        className="p-3 border border-gray-100 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {consultation.analysisType || "Consultation"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(consultation.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {consultation.concerns &&
                          consultation.concerns.length > 0
                            ? consultation.concerns.join(", ")
                            : "General consultation"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              consultation.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {consultation.status.charAt(0).toUpperCase() +
                              consultation.status.slice(1)}
                          </span>
                          <span className="text-xs text-blue-600">
                            Customer: {consultation.customerName || "N/A"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title={
                        isRTL
                          ? "لا توجد استشارات حديثة"
                          : "No Recent Consultations"
                      }
                      description={
                        isRTL
                          ? "لم يتم إجراء أي استشارات مؤخراً"
                          : "No consultations have been conducted recently"
                      }
                      className="py-8"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
