"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Room } from "livekit-client";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { SkinAnalysisLayout } from "../components/SkinAnalysisLayout";
import { useSkinAnalysisState } from "../hooks/useSkinAnalysisState";
import { OpenCVProcessor } from "../components/OpenCVProcessor";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "next-intl";
import { API_CONFIG } from "@/lib/config";

interface SkinAnalysisRoomProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function SkinAnalysisRoom({ params }: SkinAnalysisRoomProps) {
  // Unwrap params Promise for Next.js 15
  const resolvedParams = React.use(params);
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processorRef = useRef<OpenCVProcessor | null>(null);
  const cameraTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Permission testing states (like room-test)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    testing: true,
  });
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // Room connection states (for LiveKit integration)
  const [room] = useState(() => new Room());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const {
    isAnalyzing,
    isCapturing,
    faceDetected,
    analysisResults,
    error,
    cameraActive,
    updateAnalysisState,
    updateError,
    updateResults,
    updateFaceDetection,
    startCapture,
    startAnalysis,
  } = useSkinAnalysisState();

  // Check if room has been created (has token/connection details)
  const hasRoomConnection =
    searchParams.get("token") && searchParams.get("serverUrl");

  // Test camera and microphone permissions (like room-test)
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
      console.log("Connecting to skin analysis room...");

      // Setup room event listeners
      room.removeAllListeners();

      room.on("connected", () => {
        console.log("✅ Skin analysis room connected");
        setIsConnected(true);
        setIsConnecting(false);
      });

      room.on("disconnected", () => {
        console.log("❌ Skin analysis room disconnected");
        setIsConnected(false);
        setIsConnecting(false);
      });

      room.on("reconnecting", () => {
        console.log("🔄 Reconnecting to skin analysis room...");
        setIsConnecting(true);
      });

      room.on("reconnected", () => {
        console.log("✅ Skin analysis room reconnected");
        setIsConnected(true);
        setIsConnecting(false);
      });

      // Connect to the room
      await room.connect(serverUrl, token, {
        autoSubscribe: true,
      });
    } catch (error) {
      console.error("Failed to connect to skin analysis room:", error);
      setConnectionError("Failed to connect to skin analysis room");
      setIsConnecting(false);
    }
  };

  // Initialize LiveKit camera
  const initializeLiveKitCamera = async () => {
    try {
      console.log("🎥 Initializing camera for LiveKit room...");

      if (!room || !isConnected) {
        console.error("Room not connected");
        return;
      }

      // Wait for video element to be available
      let retries = 0;
      while (!videoRef.current && retries < 10) {
        console.log(`Waiting for video element... attempt ${retries + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        retries++;
      }

      if (!videoRef.current) {
        console.error("Video element not available after waiting");
        updateError("Video element not available. Please refresh the page.");
        return;
      }

      // Get the local participant's video track from LiveKit
      const localParticipant = room.localParticipant;

      // Enable camera and microphone for LiveKit
      try {
        await localParticipant.enableCameraAndMicrophone();
        console.log("✅ LiveKit camera and microphone enabled");
      } catch (enableError) {
        console.error("Failed to enable camera/microphone:", enableError);
        // Try to get camera manually if LiveKit fails
        return initializeCamera();
      }

      // Get the video track
      const videoTrack = localParticipant.videoTrackPublications.values().next()
        .value?.track;

      if (videoTrack && videoRef.current) {
        // Attach the LiveKit video track to our video element
        videoTrack.attach(videoRef.current);
        console.log("📺 LiveKit video track attached to video element");

        const onVideoReady = () => {
          console.log("🎯 LiveKit camera is ready");

          // Clear timeout immediately when camera becomes active
          if (cameraTimeoutRef.current) {
            clearTimeout(cameraTimeoutRef.current);
            cameraTimeoutRef.current = null;
          }

          updateAnalysisState({ cameraActive: true });
          setIsStarting(false);
        };

        // Set up event listeners for the video element
        videoRef.current.onloadedmetadata = () => {
          console.log("📊 LiveKit video metadata loaded");
          onVideoReady();
        };

        videoRef.current.oncanplay = () => {
          console.log("▶️ LiveKit video can play");
          onVideoReady();
        };

        // Immediate check if video is already ready
        if (videoRef.current.readyState >= 2) {
          console.log("⚡ LiveKit video already ready");
          onVideoReady();
        }

        // Fallback timeout
        setTimeout(() => {
          if (cameraTimeoutRef.current) {
            console.log("🚨 LiveKit fallback: Force activating camera");
            onVideoReady();
          }
        }, 3000);
      } else {
        console.log(
          "⚠️ No video track available, falling back to manual camera"
        );
        // Fallback to manual camera initialization
        initializeCamera();
      }
    } catch (err) {
      console.error("❌ LiveKit camera initialization failed:", err);
      // Fallback to manual camera initialization
      initializeCamera();
    }
  };

  // Initialize local camera (fallback or for non-LiveKit rooms)
  const initializeCamera = async () => {
    try {
      console.log("🎥 Initializing local camera...");

      // Wait for video element to be available
      let retries = 0;
      while (!videoRef.current && retries < 10) {
        console.log(`Waiting for video element... attempt ${retries + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        retries++;
      }

      if (!videoRef.current) {
        console.error("Video element not available after waiting");
        updateError("Video element not available. Please refresh the page.");
        return;
      }

      const videoConstraints = {
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
        facingMode: "user",
        frameRate: { ideal: 30, min: 15 },
      };

      console.log("🔍 Requesting camera with constraints:", videoConstraints);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: !!hasRoomConnection, // Only request audio for LiveKit rooms
      });

      console.log("✅ Camera stream obtained successfully", stream);
      console.log("📊 Stream details:", {
        active: stream.active,
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
        videoTrackSettings: stream.getVideoTracks()[0]?.getSettings(),
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("📺 Stream assigned to video element");
        console.log("🔍 Video element state:", {
          videoWidth: videoRef.current.videoWidth,
          videoHeight: videoRef.current.videoHeight,
          readyState: videoRef.current.readyState,
          paused: videoRef.current.paused,
          srcObject: !!videoRef.current.srcObject,
        });

        // Force important video properties
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true; // Important for autoplay

        // Set up multiple event listeners to catch when video is ready
        const onVideoReady = () => {
          console.log("🎯 Video is ready, activating camera");

          // Clear timeout immediately when camera becomes active
          if (cameraTimeoutRef.current) {
            clearTimeout(cameraTimeoutRef.current);
            cameraTimeoutRef.current = null;
          }

          updateAnalysisState({ cameraActive: true });
          setIsStarting(false);
        };

        videoRef.current.onloadedmetadata = () => {
          console.log("📊 Video metadata loaded");
          onVideoReady();
        };

        videoRef.current.oncanplay = () => {
          console.log("▶️ Video can play");
          onVideoReady();
        };

        videoRef.current.onplaying = () => {
          console.log("🎬 Video is playing");
          onVideoReady();
        };

        // Add error handler for video
        videoRef.current.onerror = (e) => {
          console.error("❌ Video error:", e);
          updateError("Video playback failed. Please refresh and try again.");
        };

        // Force video to load
        videoRef.current.load();

        // Try to play the video immediately and forcefully
        const forceVideoPlay = async () => {
          try {
            console.log("🚀 Attempting to play video...");
            if (videoRef.current) {
              await videoRef.current.play();
              console.log("✅ Video playback started successfully");
            }
          } catch (playError) {
            console.warn(
              "⚠️ Video autoplay failed, trying manual play:",
              playError
            );
            // For autoplay restrictions, we'll force play anyway
            if (videoRef.current) {
              videoRef.current.muted = true;
              try {
                await videoRef.current.play();
                console.log("✅ Video playing after muting");
              } catch (secondError) {
                console.error("❌ Still failed to play video:", secondError);
                // Force set video as active even if play fails
                setTimeout(() => {
                  console.log("🔧 Force activating camera despite play error");
                  onVideoReady();
                }, 500);
              }
            }
          }
        };

        // Start video playback
        forceVideoPlay();

        // Multiple fallback timers
        setTimeout(() => {
          if (
            cameraTimeoutRef.current &&
            videoRef.current &&
            videoRef.current.readyState >= 2
          ) {
            console.log("⚡ 1s fallback: Setting camera active");
            onVideoReady();
          }
        }, 1000);

        setTimeout(() => {
          if (cameraTimeoutRef.current) {
            console.log("🚨 3s fallback: Force activating camera");
            onVideoReady();
          }
        }, 3000);
      } else {
        console.error("❌ Video ref is null");
        updateError("Video element not available. Please refresh the page.");
      }
    } catch (err) {
      console.error("❌ Camera initialization error:", err);
      let errorMessage = "Failed to access camera. ";

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage +=
            "Please allow camera permissions and refresh the page.";
        } else if (err.name === "NotFoundError") {
          errorMessage +=
            "No camera found. Please connect a camera and try again.";
        } else if (err.name === "NotSupportedError") {
          errorMessage += "Camera not supported by your browser.";
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += "Please ensure camera permissions are granted.";
      }

      updateError(errorMessage);
    }
  };

  // Auto-test devices on page load
  useEffect(() => {
    testDevices();

    // If we have room connection details, skip permission screen and start analysis
    if (hasRoomConnection) {
      setAnalysisStarted(true);
      connectToRoom();
    }
  }, [hasRoomConnection]);

  // Initialize camera only after user starts analysis
  useEffect(() => {
    if (analysisStarted) {
      console.log("Starting camera initialization...", {
        hasRoomConnection,
        cameraActive,
        analysisStarted,
        isConnected,
      });

      // Clear any existing timeout
      if (cameraTimeoutRef.current) {
        clearTimeout(cameraTimeoutRef.current);
      }

      // For LiveKit rooms, wait for connection before initializing camera
      if (hasRoomConnection) {
        if (isConnected) {
          console.log("LiveKit connected, initializing camera for room");
          initializeLiveKitCamera();
        } else {
          console.log("Waiting for LiveKit connection...");
          // Timeout for LiveKit connection
          cameraTimeoutRef.current = setTimeout(() => {
            console.error("LiveKit connection timed out");
            updateError(
              "Failed to connect to analysis room. Please check your connection and try again."
            );
          }, 20000); // 20 second timeout for LiveKit
        }
      } else {
        // For non-LiveKit rooms, use direct camera access
        console.log("Initializing local camera");
        initializeCamera();

        // Add timeout to prevent hanging
        cameraTimeoutRef.current = setTimeout(() => {
          console.error("Camera initialization timed out");
          updateError(
            "Camera initialization timed out. Please check permissions and try again."
          );
        }, 15000); // 15 second timeout for local camera
      }
    }
  }, [analysisStarted, isConnected, hasRoomConnection]);

  // Initialize OpenCV processor when camera becomes active
  useEffect(() => {
    if (cameraActive && videoRef.current && canvasRef.current) {
      console.log("🔧 Initializing OpenCV processor...");

      if (!processorRef.current) {
        processorRef.current = new OpenCVProcessor(
          videoRef.current,
          canvasRef.current
        );

        // Set the face detection callback
        processorRef.current.setFaceDetectionCallback(updateFaceDetection);
      }

      // OpenCV processor starts automatically when initialized

      // Cleanup function
      return () => {
        if (processorRef.current) {
          processorRef.current.cleanup();
        }
      };
    }
  }, [cameraActive, updateFaceDetection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear timeout
      if (cameraTimeoutRef.current) {
        clearTimeout(cameraTimeoutRef.current);
      }

      // Stop video stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      // Stop OpenCV processing
      if (processorRef.current) {
        processorRef.current.cleanup();
      }

      // Disconnect from room
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  // Handle starting the analysis
  const handleStartAnalysis = async () => {
    if (!hasAcceptedTerms) {
      alert("Please accept the terms and conditions first.");
      return;
    }

    setIsStarting(true);
    setAnalysisStarted(true);
  };

  // Handle creating a new room (for non-LiveKit rooms)
  const handleCreateRoom = async () => {
    if (!user) {
      updateError("Please log in to create a room");
      return;
    }

    try {
      setIsStarting(true);
      console.log("Creating new skin analysis room...");

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`, // Use user.id instead of accessToken
        },
        body: JSON.stringify({
          name: `Skin Analysis - ${new Date().toISOString()}`,
          type: "skin-analysis",
          maxParticipants: 1,
          metadata: {
            roomType: "skin-analysis",
            userId: user.id,
            createdAt: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const roomData = await response.json();
      console.log("✅ Room created successfully:", roomData);

      // Redirect to the new room with connection details
      if (typeof window !== 'undefined' && window.location) {
        const currentUrl = window.location.origin + window.location.pathname;
        const roomUrl = new URL(currentUrl);
        roomUrl.searchParams.set("token", roomData.token);
        roomUrl.searchParams.set("serverUrl", roomData.serverUrl);
        roomUrl.searchParams.set("roomName", roomData.name);

        console.log("🔄 Redirecting to room with connection details");
        window.location.href = roomUrl.toString();
      } else {
        console.error("❌ Window location not available");
        updateError("Navigation error. Please refresh and try again.");
      }
    } catch (error) {
      console.error("❌ Failed to create room:", error);
      updateError("Failed to create room. Please try again.");
      setIsStarting(false);
    }
  };

  // Permission testing screen (like room-test)
  if (!analysisStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Skin Analysis Room
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced AI-powered skin analysis using computer vision
            </p>
          </div>

          {/* Device Status */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    devicePermissions.testing
                      ? "bg-yellow-500"
                      : devicePermissions.camera
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Camera
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {devicePermissions.testing
                  ? "Testing..."
                  : devicePermissions.camera
                  ? "Ready"
                  : "Blocked"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    devicePermissions.testing
                      ? "bg-yellow-500"
                      : devicePermissions.microphone
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Microphone
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {devicePermissions.testing
                  ? "Testing..."
                  : devicePermissions.microphone
                  ? "Ready"
                  : "Blocked"}
              </span>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAcceptedTerms}
                onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                I agree to the terms and conditions for AI-powered skin analysis
                and consent to video processing for analysis purposes.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {hasRoomConnection ? (
              <button
                onClick={handleStartAnalysis}
                disabled={
                  !hasAcceptedTerms ||
                  !devicePermissions.camera ||
                  devicePermissions.testing ||
                  isStarting
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isStarting ? "Starting Analysis..." : "Start Skin Analysis"}
              </button>
            ) : (
              <button
                onClick={handleCreateRoom}
                disabled={
                  !hasAcceptedTerms ||
                  !devicePermissions.camera ||
                  devicePermissions.testing ||
                  isStarting
                }
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isStarting ? "Creating Room..." : "Create Analysis Room"}
              </button>
            )}

            <button
              onClick={testDevices}
              disabled={devicePermissions.testing}
              className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {devicePermissions.testing
                ? "Testing Devices..."
                : "Test Devices Again"}
            </button>
          </div>

          {/* Connection Status */}
          {hasRoomConnection && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected
                      ? "bg-green-500"
                      : isConnecting
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {isConnected
                    ? "Connected to Analysis Room"
                    : isConnecting
                    ? "Connecting..."
                    : connectionError || "Disconnected"}
                </span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main analysis interface
  const roomContent = (
    <SkinAnalysisLayout
      videoRef={videoRef}
      canvasRef={canvasRef}
      faceDetected={faceDetected}
      isAnalyzing={isAnalyzing}
      isCapturing={isCapturing}
      analysisResults={analysisResults}
      userId={user?.id}
      roomId={resolvedParams.id}
      onCapture={startCapture}
      processor={processorRef.current}
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
      className="min-h-screen"
    >
      {roomContent}
      <RoomAudioRenderer />
    </LiveKitRoom>
  ) : (
    <div className="min-h-screen">{roomContent}</div>
  );
}
