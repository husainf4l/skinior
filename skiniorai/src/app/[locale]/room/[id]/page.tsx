"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Room as LiveKitRoomClass } from "livekit-client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  TrackReferenceOrPlaceholder,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { RoomLayout } from "../components/RoomLayout";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useLocale, useTranslations } from "next-intl";

interface RoomProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function Room({ params }: RoomProps) {
  // Unwrap params Promise for Next.js 15
  const resolvedParams = React.use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations('room');
  const videoRef = useRef<HTMLVideoElement>(null);

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
  const [room] = useState(() => new LiveKitRoomClass());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Simplified room state for AI session
  const [currentView, setCurrentView] = useState("camera");
  const [error, setError] = useState<string | null>(null);

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
          <p className="text-gray-600">
            {isRTL ? "إعادة توجيه..." : "Redirecting..."}
          </p>
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

    // Prevent multiple connection attempts
    if (isConnecting || isConnected) {
      console.log("Connection already in progress or established");
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError(null);
      console.log("Connecting to room...");

      // Setup room event listeners (only if not already set)
      if (room.listenerCount("connected") === 0) {
        room.on("connected", () => {
          console.log("Room connected");
          setIsConnected(true);
          setIsConnecting(false);
          setAnalysisStarted(true);
        });

        room.on("disconnected", (reason) => {
          console.log("Room disconnected:", reason);
          // Only update state if it wasn't a manual disconnect
          if (reason?.toString() !== "CLIENT_INITIATED") {
            setIsConnected(false);
            setIsConnecting(false);
          }
        });

        room.on("reconnecting", () => {
          console.log("Reconnecting to room...");
          setIsConnecting(true);
        });

        room.on("reconnected", () => {
          console.log("Room reconnected");
          setIsConnected(true);
          setIsConnecting(false);
        });
      }

      // Connect to the room with proper error handling
      await room.connect(serverUrl, token, {
        autoSubscribe: true,
        maxRetries: 3,
      });
    } catch (error) {
      console.error("Failed to connect to room:", error);
      setConnectionError("Failed to connect to room. Please check your connection.");
      setIsConnecting(false);
    }
  };

  // Auto-test devices on page load
  useEffect(() => {
    testDevices();
  }, []);

  // Auto-connect when we have connection details
  useEffect(() => {
    if (hasRoomConnection && !isConnected && !isConnecting) {
      connectToRoom();
    }
  }, [hasRoomConnection, isConnected, isConnecting]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (room) {
        room.removeAllListeners();
        room.disconnect();
      }
    };
  }, [room]);

  const handleStartSession = async () => {
    if (!hasAcceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    if (!devicePermissions.camera || !devicePermissions.microphone) {
      alert("Please allow camera and microphone access");
      return;
    }

    setIsStarting(true);
    setAnalysisStarted(true);
  };

  // If no room connection details, show permission screen
  if (!hasRoomConnection) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-orange-50 to-rose-50 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-6 py-16 min-h-screen flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-gray-500 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Device Permissions Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('deviceCheck')}
            </h3>
            <div className="space-y-4">
              {/* Camera Permission */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                      devicePermissions.testing
                        ? "bg-orange-400 animate-pulse"
                        : devicePermissions.camera
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`} />
                  <span className="text-gray-900 font-medium">
                    {t('camera')}
                  </span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-md ${
                  devicePermissions.testing
                    ? "text-orange-700 bg-orange-50"
                    : devicePermissions.camera
                    ? "text-green-700 bg-green-50"
                    : "text-red-700 bg-red-50"
                }`}>
                  {devicePermissions.testing
                    ? t('testing')
                    : devicePermissions.camera
                    ? t('ready')
                    : t('blocked')}
                </span>
              </div>

              {/* Microphone Permission */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                      devicePermissions.testing
                        ? "bg-orange-400 animate-pulse"
                        : devicePermissions.microphone
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`} />
                  <span className="text-gray-900 font-medium">
                    {t('microphone')}
                  </span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-md ${
                  devicePermissions.testing
                    ? "text-orange-700 bg-orange-50"
                    : devicePermissions.microphone
                    ? "text-green-700 bg-green-50"
                    : "text-red-700 bg-red-50"
                }`}>
                  {devicePermissions.testing
                    ? t('testing')
                    : devicePermissions.microphone
                    ? t('ready')
                    : t('blocked')}
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
                    {t('retryDevices')}
                  </button>
                </div>
              )}
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <label htmlFor="terms" className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                id="terms"
                checked={hasAcceptedTerms}
                onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                {t('termsAgreement')}
              </span>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0 animate-pulse" />
                <p className="text-lg text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStartSession}
            disabled={
              isStarting ||
              !hasAcceptedTerms ||
              !devicePermissions.camera ||
              !devicePermissions.microphone ||
              devicePermissions.testing
            }
            className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${
              isStarting ||
              !hasAcceptedTerms ||
              !devicePermissions.camera ||
              !devicePermissions.microphone ||
              devicePermissions.testing
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {isStarting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('starting')}</span>
              </div>
            ) : (
              t('startAnalysisSession')
            )}
          </button>

          {/* Privacy Note */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              {t('secureEncrypted')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show connection error if there's one
  if (connectionError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('connectionError')}
          </h3>
          <p className="text-gray-600 mb-6">{connectionError}</p>
          <button
            onClick={() => {
              setConnectionError(null);
              setIsConnected(false);
              setIsConnecting(false);
              connectToRoom();
            }}
            className="w-full px-6 py-3 bg-orange-500 text-white font-medium rounded-2xl hover:bg-orange-600 transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  // Show connecting state
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('connecting')}
          </h3>
          <p className="text-gray-500">
            {t('connectingToServer')}
          </p>
        </div>
      </div>
    );
  }

  // Once connected, show the LiveKit room
  if (isConnected) {
    return (
      <LiveKitRoom
        video={true}
        audio={true}
        token={searchParams.get("token")!}
        serverUrl={searchParams.get("serverUrl")!}
        connect={true}
        room={room}
      >
        <RoomContent
          videoRef={videoRef}
          isConnected={isConnected}
          currentView={currentView}
          setCurrentView={setCurrentView}
          roomId={resolvedParams.id}
          userId={user?.id}
        />
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  return null;
}

// Separate component for the room content inside LiveKitRoom
function RoomContent({
  videoRef,
  isConnected,
  currentView,
  setCurrentView,
  roomId,
  userId,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isConnected: boolean;
  currentView: string;
  setCurrentView: (view: string) => void;
  roomId: string;
  userId?: string;
}) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const { localParticipant } = useLocalParticipant();

  // Auto-enable camera and microphone when connected
  useEffect(() => {
    let mounted = true;

    const enableMedia = async () => {
      if (!localParticipant || !mounted) return;

      try {
        // Check if participant exists and is ready before enabling devices
        if (localParticipant && localParticipant.identity) {
          // Enable camera
          if (!localParticipant.isCameraEnabled) {
            await localParticipant.setCameraEnabled(true);
          }
          // Enable microphone
          if (!localParticipant.isMicrophoneEnabled) {
            await localParticipant.setMicrophoneEnabled(true);
          }
          console.log("Camera and microphone enabled");
        }
      } catch (error) {
        // Don't log errors if component is unmounted
        if (mounted) {
          console.error("Failed to enable media devices:", error);
        }
      }
    };

    if (localParticipant) {
      // Add a small delay to ensure connection is established
      const timer = setTimeout(enableMedia, 1000);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }

    return () => {
      mounted = false;
    };
  }, [localParticipant]);

  return (
    <RoomLayout
      videoRef={videoRef}
      isActive={isConnected}
      participants={[]}
      messages={[]}
      currentView={currentView}
      userId={userId}
      roomId={roomId}
      onSendMessage={() => {}}
      onViewChange={setCurrentView}
      tracks={tracks}
      localParticipant={localParticipant}
    />
  );
}