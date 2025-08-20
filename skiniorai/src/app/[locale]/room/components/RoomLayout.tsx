"use client";

import React from "react";
import { useLocale } from "next-intl";
import {
  TrackReferenceOrPlaceholder,
  VideoTrack,
  ParticipantTile,
} from "@livekit/components-react";
import { LocalParticipant, Track } from "livekit-client";

interface RoomLayoutProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  participants: any[];
  messages: any[];
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
  participants,
  messages,
  currentView,
  userId,
  roomId,
  onSendMessage,
  onViewChange,
  tracks = [],
  localParticipant,
}: RoomLayoutProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {isRTL ? "غرفة التحليل الذكي" : "Smart Analysis Room"}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {isRTL ? `الغرفة: ${roomId}` : `Room: ${roomId}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {isActive
                    ? isRTL
                      ? "نشط"
                      : "Active"
                    : isRTL
                    ? "غير نشط"
                    : "Inactive"}
                </span>
              </div>

              {/* Participants Count */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {participants.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Video */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-6">
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

                {/* Video Overlay */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3">
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
                  </div>
                </div>

                {/* Recording Indicator */}
                {isActive && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>{isRTL ? "جاري التسجيل" : "Recording"}</span>
                  </div>
                )}

                {/* View Mode Toggle */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-1">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onViewChange("camera")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentView === "camera"
                          ? "bg-blue-600 text-white shadow-lg"
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
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentView === "screen"
                          ? "bg-blue-600 text-white shadow-lg"
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
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200">
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
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </button>

                <button className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl">
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

                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200">
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

            {/* Analysis Tools */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isRTL ? "أدوات التحليل" : "Analysis Tools"}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <span className="text-sm font-medium text-gray-700">
                    {isRTL ? "فحص البشرة" : "Skin Check"}
                  </span>
                </button>

                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-200 group">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <span className="text-sm font-medium text-gray-700">
                    {isRTL ? "تحليل سريع" : "Quick Scan"}
                  </span>
                </button>

                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {isRTL ? "تقارير" : "Reports"}
                  </span>
                </button>

                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 group">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <span className="text-sm font-medium text-gray-700">
                    {isRTL ? "توصيات" : "Tips"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isRTL ? "المشاركون" : "Participants"}
              </h3>

              <div className="space-y-3">
                {participants.length > 0 ? (
                  participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {participant.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {participant.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {participant.role || "Participant"}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      {isRTL ? "لا يوجد مشاركون" : "No participants"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isRTL ? "المحادثة" : "Chat"}
              </h3>

              <div className="h-64 overflow-y-auto mb-4 space-y-3">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div key={index} className="flex space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {message.sender}
                        </p>
                        <p className="text-sm text-gray-600">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                    <p className="text-gray-500 text-sm">
                      {isRTL ? "لا توجد رسائل" : "No messages"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={isRTL ? "اكتب رسالة..." : "Type a message..."}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      onSendMessage(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200">
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isRTL ? "معلومات الجلسة" : "Session Info"}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {isRTL ? "رقم الغرفة:" : "Room ID:"}
                  </span>
                  <span className="text-sm font-mono text-gray-900">
                    {roomId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {isRTL ? "الحالة:" : "Status:"}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {isActive
                      ? isRTL
                        ? "نشط"
                        : "Active"
                      : isRTL
                      ? "غير نشط"
                      : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {isRTL ? "المشاركون:" : "Participants:"}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {participants.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
