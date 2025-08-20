"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { ApiService } from "@/services/apiService";

export default function RoomTestPage() {
  const locale = useLocale();
  const router = useRouter();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const isRTL = locale === "ar";

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    testing: true,
  });

  // Authentication check - wait for loading to complete
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !authService.getToken()) {
        // Redirect to login if not authenticated
        router.push(`/${locale}/login`);
        return;
      }
    }
  }, [isAuthenticated, loading, router, locale]);

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{isRTL ? "إعادة توجيه..." : "Redirecting..."}</p>
        </div>
      </div>
    );
  }

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

  // Auto-test devices on page load
  useEffect(() => {
    testDevices();
  }, []);

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

      // Redirect to room with the authenticated room data
      router.push(
        `/${locale}/room/${data.room.name}?token=${
          data.token
        }&serverUrl=${encodeURIComponent(data.liveKitUrl)}&roomName=${data.room.name}`
      );
    } catch (error: any) {
      console.error("Failed to create room:", error);
      
      if (error.message === 'UNAUTHORIZED') {
        // Token expired or invalid
        logout();
        router.push(`/${locale}/login`);
        return;
      }
      
      alert(isRTL ? "فشل في إنشاء الغرفة" : "Failed to create room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 ${
        isRTL ? "rtl font-cairo" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1
              className={`text-3xl font-bold text-gray-900 mb-2 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isRTL
                ? "استشارة العناية بالبشرة بالذكاء الاصطناعي"
                : "AI Skincare Consultation"}
            </h1>
            <p
              className={`text-gray-600 max-w-2xl mx-auto ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isRTL
                ? "احصلي على تحليل شخصي لبشرتك وتوصيات مخصصة من خبير التجميل الذكي"
                : "Get personalized skin analysis and recommendations from our AI beauty expert"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Requirements & Test */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2
                className={`text-xl font-semibold text-gray-900 mb-4 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "متطلبات النظام" : "System Requirements"}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      devicePermissions.testing
                        ? "bg-blue-100"
                        : devicePermissions.camera
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {devicePermissions.testing ? (
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : devicePermissions.camera ? (
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`${isRTL ? "font-cairo" : ""} ${
                      devicePermissions.testing
                        ? "text-blue-600"
                        : devicePermissions.camera
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {devicePermissions.testing
                      ? isRTL
                        ? "جاري اختبار الكاميرا..."
                        : "Testing Camera..."
                      : devicePermissions.camera
                      ? isRTL
                        ? "الكاميرا متاحة"
                        : "Camera Available"
                      : isRTL
                      ? "الكاميرا غير متاحة"
                      : "Camera Not Available"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      devicePermissions.testing
                        ? "bg-blue-100"
                        : devicePermissions.microphone
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {devicePermissions.testing ? (
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : devicePermissions.microphone ? (
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`${isRTL ? "font-cairo" : ""} ${
                      devicePermissions.testing
                        ? "text-blue-600"
                        : devicePermissions.microphone
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {devicePermissions.testing
                      ? isRTL
                        ? "جاري اختبار الميكروفون..."
                        : "Testing Microphone..."
                      : devicePermissions.microphone
                      ? isRTL
                        ? "الميكروفون متاح"
                        : "Microphone Available"
                      : isRTL
                      ? "الميكروفون غير متاح"
                      : "Microphone Not Available"}
                  </span>
                </div>

                {!devicePermissions.testing &&
                  (!devicePermissions.camera ||
                    !devicePermissions.microphone) && (
                    <div
                      className={`mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg ${
                        isRTL ? "text-right" : ""
                      }`}
                    >
                      <p
                        className={`text-sm text-yellow-800 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL
                          ? "يرجى السماح بالوصول للكاميرا والميكروفون في إعدادات المتصفح ثم إعادة تحميل الصفحة"
                          : "Please allow camera and microphone access in your browser settings and refresh the page"}
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className={`mt-2 text-sm text-yellow-800 underline hover:text-yellow-900 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "إعادة تحميل الصفحة" : "Refresh Page"}
                      </button>
                    </div>
                  )}
              </div>
            </div>

            {/* Terms and Disclaimer */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2
                className={`text-xl font-semibold text-gray-900 mb-4 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "الشروط والأحكام" : "Terms & Disclaimer"}
              </h2>

              <div
                className={`space-y-3 text-sm text-gray-600 ${
                  isRTL ? "font-cairo text-right" : ""
                }`}
              >
                <p>
                  {isRTL
                    ? "هذه الاستشارة مقدمة بواسطة الذكاء الاصطناعي لأغراض إعلامية فقط ولا تحل محل المشورة الطبية المتخصصة."
                    : "This AI consultation is for informational purposes only and does not replace professional medical advice."}
                </p>
                <p>
                  {isRTL
                    ? "يرجى استشارة طبيب الأمراض الجلدية للحصول على تشخيص وعلاج دقيق لمشاكل البشرة."
                    : "Please consult a dermatologist for accurate diagnosis and treatment of skin conditions."}
                </p>
                <p>
                  {isRTL
                    ? "سيتم تسجيل هذه الجلسة لأغراض ضمان الجودة والتحسين."
                    : "This session may be recorded for quality assurance and improvement purposes."}
                </p>
                <p>
                  {isRTL
                    ? "بياناتك الشخصية محمية ولن يتم مشاركتها مع أطراف ثالثة."
                    : "Your personal data is protected and will not be shared with third parties."}
                </p>
              </div>

              <label className="flex items-start gap-3 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAcceptedTerms}
                  onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span
                  className={`text-sm text-gray-700 ${
                    isRTL ? "font-cairo text-right" : ""
                  }`}
                >
                  {isRTL
                    ? "أوافق على الشروط والأحكام وأفهم أن هذه استشارة معلوماتية بالذكاء الاصطناعي"
                    : "I agree to the terms and conditions and understand this is an AI informational consultation"}
                </span>
              </label>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleStartSession}
              disabled={
                !hasAcceptedTerms ||
                !devicePermissions.camera ||
                !devicePermissions.microphone ||
                isLoading
              }
              className={`bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 px-8 rounded-lg font-medium transition-colors ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isRTL ? "جاري إنشاء الجلسة..." : "Creating Session..."}
                </div>
              ) : isRTL ? (
                "بدء الاستشارة"
              ) : (
                "Start Consultation"
              )}
            </button>

            {(!hasAcceptedTerms ||
              !devicePermissions.camera ||
              !devicePermissions.microphone) && (
              <p
                className={`mt-2 text-sm text-gray-500 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "يرجى اختبار الأجهزة والموافقة على الشروط للمتابعة"
                  : "Please test devices and accept terms to continue"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
