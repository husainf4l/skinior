"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardService } from "@/services/dashboardService";
import {
  DashboardSkeleton,
  ErrorState,
  EmptyState,
} from "@/components/dashboard/DashboardSkeleton";

export default function ConsultationDetailPage() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;

  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await DashboardService.getConsultationDetails(consultationId);
        setConsultation(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch consultation details');
        if (err instanceof Error && err.message === 'UNAUTHORIZED') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) {
      fetchConsultation();
    }
  }, [consultationId, router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
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
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "aging":
        return (
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "hydration":
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        );
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
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
              message={error}
              onRetry={() => window.location.reload()}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!consultation) {
    return (
      <DashboardLayout>
        <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
          <div className="max-w-7xl mx-auto">
            <EmptyState
              title={isRTL ? "لا توجد استشارة" : "Consultation Not Found"}
              description={isRTL ? "لم يتم العثور على الاستشارة المطلوبة" : "The requested consultation could not be found"}
              actionLabel={isRTL ? "العودة للاستشارات" : "Back to Consultations"}
              onAction={() => router.push(`/${locale}/dashboard/consultations`)}
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
            <div className="flex items-center space-x-4">
              <Link
                href={`/${locale}/dashboard/consultations`}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1
                  className={`text-3xl font-bold text-gray-900 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {consultation.analysisType || "Skin Analysis"}
                </h1>
                <p
                  className={`text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {formatDate(consultation.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  consultation.status
                )}`}
              >
                {getStatusText(consultation.status)}
              </span>
              {consultation.improvementScore && (
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">
                    +{consultation.improvementScore}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {isRTL ? "تحسن" : "Improvement"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Consultation Overview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    {getAnalysisIcon(consultation.analysisType)}
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-semibold text-gray-900 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {consultation.analysisType || "Skin Analysis"}
                    </h2>
                    <p className="text-gray-600">
                      {isRTL ? "مستشار:" : "Advisor:"} {consultation.advisorName || "AI Beauty Advisor"}
                    </p>
                  </div>
                </div>

                {/* Consultation Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">
                      {isRTL ? "المدة" : "Duration"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {consultation.duration || 30} {isRTL ? "دقيقة" : "min"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">
                      {isRTL ? "التاريخ" : "Date"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(consultation.createdAt).split(",")[0]}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">
                      {isRTL ? "الوقت" : "Time"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(consultation.createdAt).split(",")[1]}
                    </p>
                  </div>
                </div>

                {/* Concerns */}
                {consultation.concerns && consultation.concerns.length > 0 && (
                  <div className="mb-6">
                    <h3
                      className={`text-lg font-semibold text-gray-900 mb-3 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {isRTL ? "المخاوف المذكورة" : "Concerns Mentioned"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {consultation.concerns.map((concern: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {consultation.notes && (
                  <div>
                    <h3
                      className={`text-lg font-semibold text-gray-900 mb-3 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {isRTL ? "ملاحظات" : "Notes"}
                    </h3>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-gray-700">{consultation.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Skin Analysis Results */}
              {consultation.skinAnalysis && Object.keys(consultation.skinAnalysis).length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2
                    className={`text-xl font-semibold text-gray-900 mb-6 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "نتائج تحليل البشرة" : "Skin Analysis Results"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(consultation.skinAnalysis).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            {typeof value === 'number' ? `${value}%` : value}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${typeof value === 'number' ? value : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {consultation.recommendations && consultation.recommendations.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2
                    className={`text-xl font-semibold text-gray-900 mb-6 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "التوصيات" : "Recommendations"}
                  </h2>
                  <div className="space-y-4">
                    {consultation.recommendations.map((rec: any, index: number) => (
                      <div key={rec.id || index} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">{index + 1}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {rec.title}
                            </h3>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              rec.priority
                            )}`}
                          >
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 capitalize">
                            {rec.category}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            {isRTL ? "عرض التفاصيل" : "View Details"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3
                  className={`text-lg font-semibold text-gray-900 mb-4 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "إجراءات سريعة" : "Quick Actions"}
                </h3>
                <div className="space-y-3">
                  <Link
                    href={`/${locale}/room`}
                    className="flex items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? "mr-3 ml-0" : ""}`}>
                      <p className={`font-medium text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                        {isRTL ? "استشارة جديدة" : "New Consultation"}
                      </p>
                      <p className={`text-xs text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
                        {isRTL ? "احصل على تحليل جديد" : "Get a new analysis"}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/${locale}/dashboard/treatments`}
                    className="flex items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? "mr-3 ml-0" : ""}`}>
                      <p className={`font-medium text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                        {isRTL ? "خطط العلاج" : "Treatment Plans"}
                      </p>
                      <p className={`text-xs text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
                        {isRTL ? "عرض خطط العلاج" : "View treatment plans"}
                      </p>
                    </div>
                  </Link>

                  <button className="flex items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors w-full">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? "mr-3 ml-0" : ""}`}>
                      <p className={`font-medium text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                        {isRTL ? "مشاركة النتائج" : "Share Results"}
                      </p>
                      <p className={`text-xs text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
                        {isRTL ? "مشاركة مع الطبيب" : "Share with doctor"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Progress Summary */}
              {consultation.improvementScore && (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-100 shadow-sm p-6">
                  <h3
                    className={`text-lg font-semibold text-gray-900 mb-4 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isRTL ? "ملخص التقدم" : "Progress Summary"}
                  </h3>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        +{consultation.improvementScore}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isRTL ? "تحسن في حالة البشرة" : "Improvement in skin condition"}
                    </p>
                  </div>
                </div>
              )}

              {/* Related Consultations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3
                  className={`text-lg font-semibold text-gray-900 mb-4 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "استشارات ذات صلة" : "Related Consultations"}
                </h3>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Acne Analysis</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Hydration Check</p>
                    <p className="text-xs text-gray-500">1 month ago</p>
                  </div>
                </div>
                <Link
                  href={`/${locale}/dashboard/consultations`}
                  className="block text-center mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {isRTL ? "عرض الكل" : "View All"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}



