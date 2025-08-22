"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useTreatments } from "@/hooks/useDashboard";
import {
  DashboardSkeleton,
  TreatmentCardSkeleton,
  ErrorState,
  EmptyState,
} from "@/components/dashboard/DashboardSkeleton";

export default function TreatmentsPage() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);

  const {
    treatments,
    loading,
    error,
    createTreatment,
    updateTreatment,
    refetch,
  } = useTreatments();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "paused":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return isRTL ? "نشط" : "Active";
      case "paused":
        return isRTL ? "متوقف مؤقتاً" : "Paused";
      case "completed":
        return isRTL ? "مكتمل" : "Completed";
      case "cancelled":
        return isRTL ? "ملغي" : "Cancelled";
      default:
        return status;
    }
  };

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
                  ? "Please log in to access your treatments"
                  : error
              }
              onRetry={refetch}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-3xl font-bold text-gray-900 mb-2 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "خطط العلاج" : "Treatment Plans"}
              </h1>
              <p
                className={`text-gray-600 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "إدارة خطط العلاج المخصصة الخاصة بك"
                  : "Manage your personalized treatment plans"}
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>
                {isRTL ? "خطة علاج جديدة" : "New Treatment Plan"}
              </span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "إجمالي الخطط" : "Total Plans"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {treatments?.length || 0}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "نشط" : "Active"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {treatments?.filter((t: any) => t.status === "active").length || 0}
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

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "مكتمل" : "Completed"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {treatments?.filter((t: any) => t.status === "completed").length || 0}
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

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "متوسط التقدم" : "Avg Progress"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {treatments && treatments.length > 0
                      ? Math.round(
                          treatments.reduce((acc: number, t: any) => acc + (t.progress || 0), 0) /
                            treatments.length
                        )
                      : 0}%
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

          {/* Treatments List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2
                className={`text-xl font-semibold text-gray-900 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "خطط العلاج" : "Treatment Plans"}
              </h2>
            </div>
            <div className="p-6">
              {treatments && treatments.length > 0 ? (
                <div className="space-y-6">
                  {treatments.map((treatment: any) => (
                    <div
                      key={treatment.id}
                      className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
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
                                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {treatment.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {isRTL ? "بدأ في" : "Started"} {formatDate(treatment.startDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              treatment.status
                            )}`}
                          >
                            {getStatusText(treatment.status)}
                          </span>
                          <button
                            onClick={() => setSelectedTreatment(treatment)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {isRTL ? "عرض التفاصيل" : "View Details"}
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {isRTL ? "التقدم" : "Progress"}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {treatment.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${treatment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Treatment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">
                            {isRTL ? "الأسبوع الحالي:" : "Current Week:"}
                          </span>{" "}
                          {treatment.currentWeek || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">
                            {isRTL ? "المرحلة التالية:" : "Next Milestone:"}
                          </span>{" "}
                          {treatment.nextMilestone || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">
                            {isRTL ? "المدة:" : "Duration:"}
                          </span>{" "}
                          {treatment.durationWeeks ? `${treatment.durationWeeks} weeks` : "Ongoing"}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                        {treatment.status === "active" && (
                          <button
                            onClick={() =>
                              updateTreatment(treatment.id, { status: "paused" })
                            }
                            className="px-4 py-2 text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors"
                          >
                            {isRTL ? "إيقاف مؤقت" : "Pause"}
                          </button>
                        )}
                        {treatment.status === "paused" && (
                          <button
                            onClick={() =>
                              updateTreatment(treatment.id, { status: "active" })
                            }
                            className="px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            {isRTL ? "استئناف" : "Resume"}
                          </button>
                        )}
                        <button
                          onClick={() =>
                            updateTreatment(treatment.id, { status: "completed" })
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {isRTL ? "إكمال" : "Complete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={
                    isRTL ? "لا توجد خطط علاج" : "No Treatment Plans"
                  }
                  description={
                    isRTL
                      ? "لم يتم إنشاء أي خطط علاج بعد. ابدأ بإنشاء خطة علاج مخصصة."
                      : "You haven't created any treatment plans yet. Start by creating a personalized treatment plan."
                  }
                  actionLabel={isRTL ? "إنشاء خطة علاج" : "Create Treatment Plan"}
                  onAction={() => setShowCreateForm(true)}
                  icon={
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
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                  }
                />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <h3
              className={`text-lg font-semibold text-gray-900 mb-4 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isRTL ? "إجراءات سريعة" : "Quick Actions"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href={`/${locale}/room`}
                className="flex items-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
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
                    {isRTL ? "استشارة ذكية" : "AI Consultation"}
                  </p>
                  <p
                    className={`text-sm text-gray-600 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "احصل على توصيات مخصصة" : "Get personalized recommendations"}
                  </p>
                </div>
              </Link>

              <Link
                href={`/${locale}/skin-analysis`}
                className="flex items-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
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
                    className={`text-sm text-gray-600 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "تحليل شامل للبشرة" : "Comprehensive skin analysis"}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className={`ml-3 ${isRTL ? "mr-3 ml-0" : ""}`}>
                  <p
                    className={`font-medium text-gray-900 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "خطة علاج جديدة" : "New Treatment Plan"}
                  </p>
                  <p
                    className={`text-sm text-gray-600 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "إنشاء خطة مخصصة" : "Create custom plan"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
