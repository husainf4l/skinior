"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { ApiService } from "@/services/apiService";

export default function Room3Page() {
  const locale = useLocale();
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const isRTL = locale === "ar";

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    testing: true,
  });

  // Test camera and microphone permissions
  const testDevices = async () => {
    try {
      setDevicePermissions((prev) => ({ ...prev, testing: true }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setDevicePermissions({
        camera: true,
        microphone: true,
        testing: false,
      });

      // Stop the stream after testing
      stream.getTracks().forEach((track) => track.stop());

      return true;
    } catch (error) {
      console.error("Device access error:", error);
      setDevicePermissions({
        camera: false,
        microphone: false,
        testing: false,
      });
      return false;
    }
  };

  // Check authentication on component mount - wait for loading to complete
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !authService.getToken()) {
        // Redirect to login if no user or token
        router.push(`/${locale}/login`);
        return;
      }
    }
  }, [isAuthenticated, loading, router, locale]);

  // Auto-test devices on page load
  useEffect(() => {
    // Only test devices if authenticated and not loading
    if (!loading && isAuthenticated && authService.getToken()) {
      testDevices();
    }
  }, [isAuthenticated, loading]);

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (after loading is complete)
  if (!isAuthenticated || !authService.getToken()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{isRTL ? "إعادة توجيه..." : "Redirecting..."}</p>
        </div>
      </div>
    );
  }

  const handleStartSession = async () => {
    if (!hasAcceptedTerms) {
      alert(
        isRTL
          ? "يرجى الموافقة على الشروط والأحكام"
          : "Please accept the terms and conditions"
      );
      return;
    }

    if (!devicePermissions.camera || !devicePermissions.microphone) {
      alert(
        isRTL
          ? "يرجى السماح بالوصول للكاميرا والميكروفون"
          : "Please allow camera and microphone access"
      );
      return;
    }

    setIsLoading(true);

    // Create room with authenticated API service
    try {
      const data = await ApiService.createRoom(
        locale === "ar" ? "arabic" : "english",
        "general_analysis"
      );

      // Redirect to room3 with the authenticated room data
      const roomUrl = `/${locale}/room3/${data.room.name}?token=${data.token}&serverUrl=${data.liveKitUrl}&roomName=${data.room.name}`;
      router.push(roomUrl);
    } catch (error: any) {
      console.error("Error creating room:", error);
      
      if (error.message === 'UNAUTHORIZED') {
        // Token expired or invalid
        logout();
        router.push(`/${locale}/login`);
        return;
      }
      
      alert(isRTL ? "فشل في إنشاء الغرفة" : "Failed to create room");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 ${
                    isRTL ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {isRTL ? "غرفة التحليل الذكي" : "Smart Analysis Room"}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isRTL
              ? "تحليل البشرة بالذكاء الاصطناعي"
              : "AI-Powered Skin Analysis"}
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {isRTL
              ? "احصل على تحليل شامل ودقيق لبشرتك باستخدام أحدث تقنيات الذكاء الاصطناعي مع توصيات مخصصة لروتين العناية"
              : "Get comprehensive and accurate skin analysis using the latest AI technology with personalized skincare routine recommendations"}
          </p>
        </div>

        {/* Device Permissions Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            {isRTL ? "فحص الأجهزة" : "Device Check"}
          </h3>

          <div className="space-y-4">
            {/* Camera Permission */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    devicePermissions.testing
                      ? "bg-yellow-400 animate-pulse"
                      : devicePermissions.camera
                      ? "bg-green-500 shadow-lg shadow-green-500/30"
                      : "bg-red-500 shadow-lg shadow-red-500/30"
                  }`}
                />
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">
                    {isRTL ? "الكاميرا" : "Camera"}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  devicePermissions.testing
                    ? "bg-yellow-100 text-yellow-800"
                    : devicePermissions.camera
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {devicePermissions.testing
                  ? isRTL
                    ? "جاري الفحص..."
                    : "Testing..."
                  : devicePermissions.camera
                  ? isRTL
                    ? "جاهز"
                    : "Ready"
                  : isRTL
                  ? "مرفوض"
                  : "Blocked"}
              </span>
            </div>

            {/* Microphone Permission */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    devicePermissions.testing
                      ? "bg-yellow-400 animate-pulse"
                      : devicePermissions.microphone
                      ? "bg-green-500 shadow-lg shadow-green-500/30"
                      : "bg-red-500 shadow-lg shadow-red-500/30"
                  }`}
                />
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">
                    {isRTL ? "الميكروفون" : "Microphone"}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  devicePermissions.testing
                    ? "bg-yellow-100 text-yellow-800"
                    : devicePermissions.microphone
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {devicePermissions.testing
                  ? isRTL
                    ? "جاري الفحص..."
                    : "Testing..."
                  : devicePermissions.microphone
                  ? isRTL
                    ? "جاهز"
                    : "Ready"
                  : isRTL
                  ? "مرفوض"
                  : "Blocked"}
              </span>
            </div>
          </div>

          {/* Retry Button for Failed Permissions */}
          {!devicePermissions.testing &&
            (!devicePermissions.camera || !devicePermissions.microphone) && (
              <div className="mt-6 text-center">
                <button
                  onClick={testDevices}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  {isRTL ? "إعادة المحاولة" : "Retry"}
                </button>
              </div>
            )}
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-8">
          <div className="flex items-start space-x-4">
            <input
              type="checkbox"
              id="terms"
              checked={hasAcceptedTerms}
              onChange={(e) => setHasAcceptedTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="terms" className="flex-1 cursor-pointer">
              <p className="text-gray-700 leading-relaxed">
                {isRTL ? (
                  <>
                    أوافق على{" "}
                    <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors cursor-pointer">
                      الشروط والأحكام
                    </span>{" "}
                    و{" "}
                    <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors cursor-pointer">
                      سياسة الخصوصية
                    </span>{" "}
                    الخاصة بتحليل البشرة وأفهم أن البيانات ستُستخدم لأغراض
                    التحليل فقط
                  </>
                ) : (
                  <>
                    I agree to the{" "}
                    <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors cursor-pointer">
                      Terms and Conditions
                    </span>{" "}
                    and{" "}
                    <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors cursor-pointer">
                      Privacy Policy
                    </span>{" "}
                    for skin analysis and understand that data will be used for
                    analysis purposes only
                  </>
                )}
              </p>
            </label>
          </div>
        </div>

        {/* Start Session Button */}
        <div className="text-center">
          <button
            onClick={handleStartSession}
            disabled={
              isLoading ||
              !hasAcceptedTerms ||
              !devicePermissions.camera ||
              !devicePermissions.microphone ||
              devicePermissions.testing
            }
            className={`inline-flex items-center px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl ${
              isLoading ||
              !hasAcceptedTerms ||
              !devicePermissions.camera ||
              !devicePermissions.microphone ||
              devicePermissions.testing
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                {isRTL ? "جاري الإنشاء..." : "Creating..."}
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 4a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h14z"
                  />
                </svg>
                {isRTL ? "بدء جلسة التحليل" : "Start Analysis Session"}
              </>
            )}
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isRTL ? "تحليل دقيق" : "Accurate Analysis"}
            </h3>
            <p className="text-gray-600">
              {isRTL
                ? "تحليل شامل للبشرة باستخدام الذكاء الاصطناعي"
                : "Comprehensive skin analysis using AI technology"}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isRTL ? "نتائج فورية" : "Instant Results"}
            </h3>
            <p className="text-gray-600">
              {isRTL
                ? "احصل على النتائج والتوصيات في ثوانٍ"
                : "Get results and recommendations in seconds"}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isRTL ? "توصيات مخصصة" : "Personalized Tips"}
            </h3>
            <p className="text-gray-600">
              {isRTL
                ? "نصائح مخصصة لنوع بشرتك وحالتها"
                : "Customized advice for your skin type and condition"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
