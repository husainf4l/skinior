"use client";

import React from "react";
import { useLocale } from "next-intl";
import {
  TrackReferenceOrPlaceholder,
  VideoTrack,
} from "@livekit/components-react";
import { LocalParticipant } from "livekit-client";

interface RoomLayoutProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  participants: unknown[];
  messages: unknown[];
  currentView: string;
  userId?: string;
  roomId: string;
  onSendMessage: (message: string) => void;
  onViewChange: (view: string) => void;
  tracks?: TrackReferenceOrPlaceholder[];
  localParticipant?: LocalParticipant;
}

export function RoomLayout({
  videoRef,
  isActive,
  currentView,
  onViewChange,
  tracks = [],
}: RoomLayoutProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-orange-50 to-rose-50 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full"></div>
                <div>
                  <h1 className="text-lg font-light text-gray-900">
                    {isRTL ? "سكينيور" : "Skinior"}
                  </h1>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm text-gray-600 font-medium">
                  {isActive
                    ? isRTL
                      ? "مباشر"
                      : "Live"
                    : isRTL
                    ? "غير متصل"
                    : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Main Video */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="relative">
              {/* Use LiveKit VideoTrack if available, fallback to manual video */}
              {tracks.length > 0 && tracks[0]?.publication ? (
                <div className="w-full h-96 bg-gray-900 rounded-2xl overflow-hidden">
                  <VideoTrack
                    trackRef={tracks[0]}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-96 bg-gray-900 rounded-2xl object-cover"
                />
              )}

              {/* Recording Indicator */}
              {isActive && (
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>{isRTL ? "مباشر" : "Live"}</span>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="absolute top-4 right-4 bg-white/90 rounded-2xl p-1">
                <div className="flex space-x-1">
                  <button
                    onClick={() => onViewChange("camera")}
                    className={`p-2 rounded-xl transition-colors ${
                      currentView === "camera"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
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
                  </button>
                  <button
                    onClick={() => onViewChange("screen")}
                    className={`p-2 rounded-xl transition-colors ${
                      currentView === "screen"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              <button className="group p-4 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-200">
                <svg
                  className="w-5 h-5 text-gray-700"
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
              </button>

              <button className="group p-5 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <button className="group p-4 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-200">
                <svg
                  className="w-5 h-5 text-gray-700"
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
              </button>
            </div>
          </div>

          {/* AI Analysis Status */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-medium text-gray-900">
                {isRTL
                  ? "جاري التحليل بالذكاء الاصطناعي"
                  : "AI Analysis in Progress"}
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              {isRTL
                ? "يرجى المحافظة على وضع الكاميرا لأفضل النتائج"
                : "Please maintain camera position for best results"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
