"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { ApiService } from "@/services/apiService";

export default function RoomPage() {
  const locale = useLocale();
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const isRTL = locale === "ar";
  const t = useTranslations("room");
  const tCommon = useTranslations("common");

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
          <p className="text-gray-600">{tCommon("loading")}</p>
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
          <p className="text-gray-600">{t("redirecting")}</p>
        </div>
      </div>
    );
  }

  const handleStartSession = async () => {
    if (!hasAcceptedTerms) {
      alert(t("pleaseAcceptTerms"));
      return;
    }

    if (!devicePermissions.camera || !devicePermissions.microphone) {
      alert(t("pleaseAllowAccess"));
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
      const roomUrl = `/${locale}/room/${data.room.name}?token=${data.token}&serverUrl=${data.liveKitUrl}&roomName=${data.room.name}`;
      router.push(roomUrl);
    } catch (error: any) {
      console.error("Error creating room:", error);

      if (error.message === "UNAUTHORIZED") {
        // Token expired or invalid
        logout();
        router.push(`/${locale}/login`);
        return;
      }

      alert(t("failedToCreateRoom"));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-orange-50 to-rose-50 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 sm:py-20">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Hero Image Section */}
          <div className="text-center mb-16">
            <div className="w-full h-80 mx-auto mb-12 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-orange-100 to-rose-100">
              <img
                src="/hero/hero1.webp"
                alt="Skin Analysis"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              {t("title")}
            </h1>
            <p className="text-gray-500 leading-relaxed max-w-md mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Device Permissions Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="space-y-6">
              {/* Camera Permission */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      devicePermissions.testing
                        ? "bg-orange-400 animate-pulse"
                        : devicePermissions.camera
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-gray-900 font-medium">
                    {t("camera")}
                  </span>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded-md ${
                    devicePermissions.testing
                      ? "text-orange-700 bg-orange-50"
                      : devicePermissions.camera
                      ? "text-green-700 bg-green-50"
                      : "text-red-700 bg-red-50"
                  }`}
                >
                  {devicePermissions.testing
                    ? t("testing")
                    : devicePermissions.camera
                    ? t("ready")
                    : t("blocked")}
                </span>
              </div>

              {/* Microphone Permission */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      devicePermissions.testing
                        ? "bg-orange-400 animate-pulse"
                        : devicePermissions.microphone
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-gray-900 font-medium">
                    {t("microphone")}
                  </span>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded-md ${
                    devicePermissions.testing
                      ? "text-orange-700 bg-orange-50"
                      : devicePermissions.microphone
                      ? "text-green-700 bg-green-50"
                      : "text-red-700 bg-red-50"
                  }`}
                >
                  {devicePermissions.testing
                    ? t("testing")
                    : devicePermissions.microphone
                    ? t("ready")
                    : t("blocked")}
                </span>
              </div>
            </div>

            {/* Retry Button for Failed Permissions */}
            {!devicePermissions.testing &&
              (!devicePermissions.camera || !devicePermissions.microphone) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={testDevices}
                    className="w-full py-3 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    {t("retryDevices")}
                  </button>
                </div>
              )}
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <label
              htmlFor="terms-mobile"
              className="flex items-start space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                id="terms-mobile"
                checked={hasAcceptedTerms}
                onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                {t("termsAgreement")}
              </span>
            </label>
          </div>

          {/* Start Session Button */}
          <button
            onClick={handleStartSession}
            disabled={
              isLoading ||
              !hasAcceptedTerms ||
              !devicePermissions.camera ||
              !devicePermissions.microphone ||
              devicePermissions.testing
            }
            className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${
              isLoading ||
              !hasAcceptedTerms ||
              !devicePermissions.camera ||
              !devicePermissions.microphone ||
              devicePermissions.testing
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t("creating")}</span>
              </div>
            ) : (
              t("startAnalysisSession")
            )}
          </button>

          {/* Privacy Note */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">{t("secureEncrypted")}</p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[50vh]">
            {/* Left Column - Hero Image */}
            <div className="bg-gray-900 overflow-hidden m-8 rounded-3xl flex">
              <img
                src="/hero/hero1.webp"
                alt="Skin Analysis"
                className="block w-full h-full object-cover"
              />
            </div>

            {/* Right Column - Content */}
            <div className="min-h-[50vh] flex flex-col justify-center px-12 xl:px-16 py-8 bg-white">
              <div className="max-w-md mx-auto space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-4xl xl:text-5xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
                    {t("title")}
                  </h1>
                  <p className="text-lg xl:text-xl text-gray-500 leading-relaxed">
                    {t("subtitle")}
                  </p>
                </div>

                {/* Device Permissions Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("deviceCheck")}
                  </h3>
                  <div className="space-y-4">
                    {/* Camera Permission */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            devicePermissions.testing
                              ? "bg-orange-400 animate-pulse"
                              : devicePermissions.camera
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-gray-900 font-medium">
                          {t("camera")}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          devicePermissions.testing
                            ? "text-orange-700 bg-orange-100"
                            : devicePermissions.camera
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {devicePermissions.testing
                          ? t("testing")
                          : devicePermissions.camera
                          ? t("ready")
                          : t("blocked")}
                      </span>
                    </div>

                    {/* Microphone Permission */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            devicePermissions.testing
                              ? "bg-orange-400 animate-pulse"
                              : devicePermissions.microphone
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-gray-900 font-medium">
                          {t("microphone")}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          devicePermissions.testing
                            ? "text-orange-700 bg-orange-100"
                            : devicePermissions.microphone
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {devicePermissions.testing
                          ? t("testing")
                          : devicePermissions.microphone
                          ? t("ready")
                          : t("blocked")}
                      </span>
                    </div>
                  </div>

                  {/* Retry Button for Failed Permissions */}
                  {!devicePermissions.testing &&
                    (!devicePermissions.camera ||
                      !devicePermissions.microphone) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={testDevices}
                          className="w-full py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors text-sm"
                        >
                          {t("retryDevices")}
                        </button>
                      </div>
                    )}
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <label
                    htmlFor="terms-desktop"
                    className="flex items-start space-x-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      id="terms-desktop"
                      checked={hasAcceptedTerms}
                      onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {t("termsAgreement")}
                    </span>
                  </label>
                </div>
                {/* Privacy Note */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    {t("secureEncrypted")}
                  </p>
                </div>
                {/* Start Session Button */}
                <button
                  onClick={handleStartSession}
                  disabled={
                    isLoading ||
                    !hasAcceptedTerms ||
                    !devicePermissions.camera ||
                    !devicePermissions.microphone ||
                    devicePermissions.testing
                  }
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 text-base ${
                    isLoading ||
                    !hasAcceptedTerms ||
                    !devicePermissions.camera ||
                    !devicePermissions.microphone ||
                    devicePermissions.testing
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-600 hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t("creating")}</span>
                    </div>
                  ) : (
                    t("startAnalysisSession")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
