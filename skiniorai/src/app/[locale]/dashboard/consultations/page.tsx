"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useConsultations } from "@/hooks/useDashboard";
import {
  DashboardSkeleton,
  ErrorState,
  EmptyState,
} from "@/components/dashboard/DashboardSkeleton";

export default function ConsultationsPage() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const {
    consultations,
    loading,
    error,
    refetch,
  } = useConsultations(50);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return isRTL ? "مكتملة" : "Completed";
      case "in_progress":
        return isRTL ? "جارية" : "In Progress";
      case "pending":
        return isRTL ? "في الانتظار" : "Pending";
      case "cancelled":
        return isRTL ? "ملغية" : "Cancelled";
      default:
        return status;
    }
  };

  // Get analysis type icon
  const getAnalysisIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "acne":
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "aging":
        return (
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "hydration":
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        );
    }
  };

  // Filter consultations
  const filteredConsultations = consultations?.filter((consultation: any) => {
    if (filterStatus === "all") return true;
    return consultation.status === filterStatus;
  }) || [];

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
                  ? "Please log in to access your consultations"
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
                {isRTL ? "سجل الاستشارات" : "Consultation History"}
              </h1>
              <p
                className={`text-gray-600 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "مراجعة تحليلات البشرة والتوصيات السابقة"
                  : "Review your skin analysis and previous recommendations"}
              </p>
            </div>
            <Link
              href={`/${locale}/room`}
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>
                {isRTL ? "استشارة جديدة" : "New Consultation"}
              </span>
            </Link>
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
                    {isRTL ? "إجمالي الاستشارات" : "Total Consultations"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {consultations?.length || 0}
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

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium text-gray-500 mb-1 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "مكتملة" : "Completed"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {consultations?.filter((c: any) => c.status === "completed").length || 0}
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
                    {isRTL ? "متوسط التحسن" : "Avg Improvement"}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {consultations && consultations.length > 0
                      ? Math.round(
                          consultations.reduce((acc: number, c: any) => acc + (c.improvementScore || 0), 0) /
                            consultations.length
                        )
                      : 0}%
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
                    {isRTL ? "آخر استشارة" : "Last Consultation"}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {consultations && consultations.length > 0
                      ? formatDate(consultations[0].createdAt).split(",")[0]
                      : "N/A"}
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

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl font-semibold text-gray-900 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "الاستشارات" : "Consultations"}
              </h2>
              <div className="flex space-x-2">
                {["all", "completed", "in_progress", "pending"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all"
                      ? isRTL
                        ? "الكل"
                        : "All"
                      : getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            {filteredConsultations.length > 0 ? (
              <div className="space-y-6">
                {filteredConsultations.map((consultation: any) => (
                  <div
                    key={consultation.id}
                    className="p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedConsultation(consultation)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                          {getAnalysisIcon(consultation.analysisType)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {consultation.analysisType || "Skin Analysis"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(consultation.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            consultation.status
                          )}`}
                        >
                          {getStatusText(consultation.status)}
                        </span>
                        {consultation.improvementScore && (
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">
                              +{consultation.improvementScore}%
                            </p>
                            <p className="text-xs text-gray-500">
                              {isRTL ? "تحسن" : "Improvement"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Concerns */}
                    {consultation.concerns && consultation.concerns.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {isRTL ? "المخاوف المذكورة:" : "Concerns Mentioned:"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {consultation.concerns.map((concern: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Recommendations Preview */}
                    {consultation.recommendations && consultation.recommendations.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {isRTL ? "التوصيات الرئيسية:" : "Key Recommendations:"}
                        </p>
                        <div className="space-y-2">
                          {consultation.recommendations.slice(0, 3).map((rec: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">
                                {rec.title || rec}
                              </span>
                            </div>
                          ))}
                          {consultation.recommendations.length > 3 && (
                            <p className="text-sm text-blue-600">
                              {isRTL ? `و ${consultation.recommendations.length - 3} توصيات أخرى` : `+${consultation.recommendations.length - 3} more recommendations`}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Skin Analysis Summary */}
                    {consultation.skinAnalysis && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        {Object.entries(consultation.skinAnalysis).slice(0, 3).map(([key, value]: [string, any]) => (
                          <div key={key} className="text-center">
                            <p className="text-sm font-medium text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {typeof value === 'number' ? `${value}%` : value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          {isRTL ? "مدة الاستشارة:" : "Duration:"} {consultation.duration || "30"} min
                        </span>
                        {consultation.advisorName && (
                          <span>
                            {isRTL ? "المستشار:" : "Advisor:"} {consultation.advisorName}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/${locale}/dashboard/consultations/${consultation.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {isRTL ? "عرض التفاصيل الكاملة" : "View Full Details"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title={
                  isRTL ? "لا توجد استشارات" : "No Consultations Found"
                }
                description={
                  isRTL
                    ? "لم يتم العثور على استشارات تطابق المعايير المحددة."
                    : "No consultations found matching the selected criteria."
                }
                actionLabel={isRTL ? "بدء استشارة جديدة" : "Start New Consultation"}
                onAction={() => window.location.href = `/${locale}/room`}
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                }
              />
            )}
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
                    {isRTL ? "احصل على تحليل جديد" : "Get a new analysis"}
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

              <Link
                href={`/${locale}/dashboard/treatments`}
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
                    {isRTL ? "خطط العلاج" : "Treatment Plans"}
                  </p>
                  <p
                    className={`text-sm text-gray-600 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "عرض خطط العلاج" : "View treatment plans"}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
