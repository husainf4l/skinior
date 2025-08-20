"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Room } from "livekit-client";
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  useTracks,
  TrackReferenceOrPlaceholder,
  useLocalParticipant
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Room3Layout } from "../components/Room3Layout";
import { useRoom3State } from "../hooks/useRoom3State";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useLocale } from "next-intl";

interface Room3Props {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function Room3({ params }: Room3Props) {
  // Unwrap params Promise for Next.js 15
  const resolvedParams = React.use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Permission testing states
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    testing: true,
  });
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // Room connection states
  const [room] = useState(() => new Room());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const {
    isActive,
    participants,
    messages,
    currentView,
    error,
    updateState,
    updateError,
    sendMessage,
    setCurrentView,
  } = useRoom3State();

  // Check if room has been created (has token/connection details)
  const hasRoomConnection =
    searchParams.get("token") && searchParams.get("serverUrl");

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || !authService.getToken()) {
      // Redirect to login if not authenticated
      logout();
      router.push(`/${locale}/login`);
      return;
    }
  }, [isAuthenticated, router, locale, logout]);

  // Don't render anything if not authenticated
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

  // Connect to LiveKit room when we have connection details
  const connectToRoom = async () => {
    const token = searchParams.get("token");
    const serverUrl = searchParams.get("serverUrl");
    const roomName = searchParams.get("roomName") || resolvedParams.id;

    if (!token || !serverUrl) {
      console.log("No connection details available");
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError(null);
      console.log("Connecting to room3...");

      // Setup room event listeners
      room.removeAllListeners();

      room.on("connected", () => {
        console.log("✅ Room3 connected");
        setIsConnected(true);
        setIsConnecting(false);
        updateState({ isActive: true });
      });

      room.on("disconnected", () => {
        console.log("❌ Room3 disconnected");
        setIsConnected(false);
        setIsConnecting(false);
        updateState({ isActive: false });
      });

      room.on("reconnecting", () => {
        console.log("🔄 Reconnecting to room3...");
        setIsConnecting(true);
      });

      room.on("reconnected", () => {
        console.log("✅ Room3 reconnected");
        setIsConnected(true);
        setIsConnecting(false);
      });

      // Connect to the room
      await room.connect(serverUrl, token, {
        autoSubscribe: true,
      });
    } catch (error) {
      console.error("Failed to connect to room3:", error);
      setConnectionError("Failed to connect to room");
      setIsConnecting(false);
    }
  };

  // Initialize room connection if available
  useEffect(() => {
    if (hasRoomConnection && !isConnected && !isConnecting) {
      connectToRoom();
    }
  }, [hasRoomConnection, isConnected, isConnecting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear timeout
      if (cameraTimeoutRef.current) {
        clearTimeout(cameraTimeoutRef.current);
      }

      // Disconnect from room
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  // Handle starting the session
  const handleStartSession = async () => {
    if (!hasAcceptedTerms) {
      alert(
        isRTL
          ? "يرجى الموافقة على الشروط والأحكام"
          : "Please accept the terms and conditions"
      );
      return;
    }

    setIsStarting(true);

    try {
      // Test devices first
      const devicesOk = await testDevices();

      if (!devicesOk) {
        alert(isRTL ? "فشل في الوصول للأجهزة" : "Failed to access devices");
        setIsStarting(false);
        return;
      }

      // Start the analysis
      setAnalysisStarted(true);
      setIsStarting(false);
    } catch (error) {
      console.error("Session start failed:", error);
      updateError("Failed to start session");
      setIsStarting(false);
    }
  };

  // Show permission testing screen before analysis (only if no room connection exists)
  if (!analysisStarted && !hasRoomConnection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Navigation Header */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {isRTL ? "غرفة التحليل الذكي" : "Smart Analysis Room"}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {isRTL ? "غير متصل" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Permission Testing Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isRTL ? "إعداد الجلسة" : "Session Setup"}
            </h2>
            <p className="text-gray-600">
              {isRTL
                ? "تحقق من الأذونات قبل البدء"
                : "Check permissions before starting"}
            </p>
          </div>

          {/* Device Permissions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isRTL ? "فحص الأجهزة" : "Device Check"}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      devicePermissions.testing
                        ? "bg-yellow-500 animate-pulse"
                        : devicePermissions.camera
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium text-gray-700">
                    {isRTL ? "الكاميرا" : "Camera"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
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

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      devicePermissions.testing
                        ? "bg-yellow-500 animate-pulse"
                        : devicePermissions.microphone
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium text-gray-700">
                    {isRTL ? "الميكروفون" : "Microphone"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
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
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAcceptedTerms}
                onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                {isRTL
                  ? "أوافق على الشروط والأحكام وسياسة الخصوصية"
                  : "I agree to the terms and conditions and privacy policy"}
              </span>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartSession}
              disabled={
                isStarting ||
                !hasAcceptedTerms ||
                !devicePermissions.camera ||
                !devicePermissions.microphone ||
                devicePermissions.testing
              }
              className={`inline-flex items-center px-8 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                isStarting ||
                !hasAcceptedTerms ||
                !devicePermissions.camera ||
                !devicePermissions.microphone ||
                devicePermissions.testing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isStarting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isRTL ? "جاري البدء..." : "Starting..."}
                </>
              ) : (
                <>{isRTL ? "بدء الجلسة" : "Start Session"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main room interface
  const roomContent = (
    <Room3Layout
      videoRef={videoRef}
      isActive={isActive}
      participants={participants}
      messages={messages}
      currentView={currentView}
      userId={user?.id}
      roomId={resolvedParams.id}
      onSendMessage={sendMessage}
      onViewChange={setCurrentView}
    />
  );

  // Render with or without LiveKit wrapper
  return hasRoomConnection && isConnected ? (
    <LiveKitRoom
      room={room}
      serverUrl={searchParams.get("serverUrl") || ""}
      token={searchParams.get("token") || ""}
      connectOptions={{
        autoSubscribe: true,
      }}
      options={{
        // Enable camera and microphone by default
        videoCaptureDefaults: {
          resolution: {
            width: 1280,
            height: 720,
          },
          facingMode: 'user',
        },
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }}
      className="min-h-screen"
    >
      <RoomContent 
        roomContent={roomContent}
        videoRef={videoRef}
        isActive={isActive}
        participants={participants}
        messages={messages}
        currentView={currentView}
        userId={user?.id}
        roomId={resolvedParams.id}
        onSendMessage={sendMessage}
        onViewChange={setCurrentView}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  ) : (
    <div className="min-h-screen">{roomContent}</div>
  );
}

// Component that uses LiveKit hooks inside LiveKitRoom context
function RoomContent({
  roomContent,
  videoRef,
  isActive,
  participants,
  messages,
  currentView,
  userId,
  roomId,
  onSendMessage,
  onViewChange,
}: {
  roomContent: React.ReactNode;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  participants: any[];
  messages: any[];
  currentView: string;
  userId?: string;
  roomId: string;
  onSendMessage: (message: string) => void;
  onViewChange: (view: string) => void;
}) {
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  // Enable camera and microphone when component mounts
  useEffect(() => {
    const enableMedia = async () => {
      try {
        // Enable camera
        await localParticipant.setCameraEnabled(true);
        // Enable microphone
        await localParticipant.setMicrophoneEnabled(true);
        console.log("✅ Camera and microphone enabled");
      } catch (error) {
        console.error("❌ Failed to enable media devices:", error);
      }
    };

    if (localParticipant) {
      enableMedia();
    }
  }, [localParticipant]);

  return (
    <Room3Layout
      videoRef={videoRef}
      isActive={isActive}
      participants={participants}
      messages={messages}
      currentView={currentView}
      userId={userId}
      roomId={roomId}
      onSendMessage={onSendMessage}
      onViewChange={onViewChange}
      tracks={tracks}
      localParticipant={localParticipant}
    />
  );
}
