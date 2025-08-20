import { useCallback, useEffect, useRef } from "react";
import { Room } from "livekit-client";
import { ReadonlyURLSearchParams } from "next/navigation";
import { API_CONFIG } from "@/lib/config";

interface JobInfo {
  title?: string;
  location?: string;
  experience?: string;
}

interface CompanyInfo {
  name?: string;
  logo?: string;
}

interface UseRoomConnectionProps {
  room: Room;
  searchParams: ReadonlyURLSearchParams;
  onConnectionChange: (connected: boolean, connecting: boolean) => void;
  onError: (error: string | null) => void;
  onJobDataUpdate?: (jobData: JobInfo, companyData: CompanyInfo, participantData: string) => void;
  userId?: string;
  roomId?: string;
}

export function useRoomConnection({
  room,
  searchParams,
  onConnectionChange,
  onError,
  onJobDataUpdate,
  userId,
  roomId
}: UseRoomConnectionProps) {
  const isConnectingRef = useRef(false);

  const connectToRoom = useCallback(async () => {
    if (isConnectingRef.current) {
      console.log("⚠️ Connection already in progress, skipping...");
      return;
    }
    try {
      isConnectingRef.current = true;
      console.log("🔄 Starting room connection...");
      onConnectionChange(false, true);
      onError(null);

      // Extract connection parameters
      const directToken = searchParams.get("token");
      const directRoomName = searchParams.get("roomName");
      const directServerUrl = searchParams.get("serverUrl");

      console.log("📋 Connection parameters:", {
        directToken: !!directToken,
        directRoomName,
        directServerUrl,
        roomId
      });

      let token = directToken;
      let roomName = directRoomName || roomId; // Use roomId if no direct room name
      let serverUrl = directServerUrl || "wss://widdai-aphl2lb9.livekit.cloud";

      // Create room via backend if needed
      if (!token) {
        console.log("🏗️ Creating room via backend...");
        
        // Get user ID from props or URL params
        const userIdFromUrl = searchParams.get("userId");
        const roomNameFromUrl = searchParams.get("roomName");
        
        // Determine language from locale
        const locale = window.location.pathname.split('/')[1];
        const language = locale === 'ar' ? 'arabic' : 'english';
        
        const requestBody: any = { language };
        if (userId || userIdFromUrl) requestBody.userId = userId || userIdFromUrl;
        if (roomNameFromUrl) requestBody.roomName = roomNameFromUrl;
        
        console.log("📋 Room creation payload:", requestBody);
        
        const createResponse = await fetch(
          `${API_CONFIG.API_BASE_URL}/rooms`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );

        if (!createResponse.ok) {
          throw new Error(`Failed to create room: ${await createResponse.text()}`);
        }

        const createData = await createResponse.json();
        console.log("✅ Room created successfully:", createData);

        token = createData.token;
        roomName = createData.room?.name;
        serverUrl = createData.liveKitUrl;

        console.log("🔍 Extracted connection details:", {
          token: !!token,
          roomName,
          serverUrl,
          language: createData.language,
          roomType: createData.room?.metadata?.type
        });

        // Extract skincare consultation data from backend response
        if (onJobDataUpdate) {
          // For skincare consultation, we'll use different data structure
          const jobData = {
            title: createData.room?.metadata?.type === 'skincare_consultation' ? 
              (createData.language === 'arabic' ? 'استشارة العناية بالبشرة' : 'Skincare Consultation') : 
              'Consultation',
            location: null,
            experience: null
          };

          const companyData = {
            name: 'Skinior',
            logo: undefined
          };

          const participantData = createData.participantName || `User ${createData.room?.metadata?.createdBy || 'Guest'}`;

          console.log("📊 Extracted skincare data:", { jobData, companyData, participantData });
          onJobDataUpdate(jobData, companyData, participantData);
        }
      }

      if (!token || !roomName) {
        console.error("❌ Missing required parameters:", { token: !!token, roomName });
        throw new Error(`Missing required parameters - token: ${!!token}, roomName: ${!!roomName}`);
      }

      console.log("🚀 Connecting to LiveKit room:", { roomName, serverUrl });

      // Setup room event listeners
      room.removeAllListeners();

      // Add mobile-specific error handling
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      room.on("connected", () => {
        console.log("✅ Room connected successfully");
        isConnectingRef.current = false;
        onConnectionChange(true, false);
      });

      room.on("disconnected", (reason) => {
        console.log("❌ Room disconnected:", reason);
        isConnectingRef.current = false;
        onConnectionChange(false, false);

        // Handle mobile-specific disconnection scenarios
        if (isMobile) {
          console.log("🔄 Mobile disconnection detected, preparing for potential recovery...");
          setTimeout(() => {
            if (room.state !== 'connected') {
              console.log("🔄 Room still disconnected on mobile device");
              // Don't automatically reconnect to avoid loops, let user retry
            }
          }, 2000);
        }
      });

      room.on("reconnecting", () => {
        console.log("🔄 Room reconnecting...");
        onConnectionChange(false, true);
      });

      room.on("reconnected", () => {
        console.log("✅ Room reconnected");
        isConnectingRef.current = false;
        onConnectionChange(true, false);
      });

      // Add mobile-specific connection error handling
      room.on("connectionQualityChanged", (quality) => {
        if (isMobile && quality === 'poor') {
          console.warn("⚠️ Poor connection quality detected on mobile device");
          // Could implement automatic quality reduction here
        }
      });

      // Connect to room with mobile-optimized settings
      const connectionConfig = {
        autoSubscribe: true,
        rtcConfig: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
          // Add mobile-specific ICE configuration
          ...(isMobile && {
            iceTransportPolicy: 'all' as RTCIceTransportPolicy,
            bundlePolicy: 'max-bundle' as RTCBundlePolicy,
            rtcpMuxPolicy: 'require' as RTCRtcpMuxPolicy,
          }),
        },
        // Mobile-specific audio optimizations for better clarity
        ...(isMobile && {
          audioCaptureDefaults: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000, // Higher sample rate for better quality
            channelCount: 1, // Mono to reduce bandwidth
          },
          audioPlaybackDefaults: {
            autoGainControl: false, // Disable AGC for playback
            echoCancellation: false, // Not needed for playback
            noiseSuppression: false, // Not needed for playback
          },
        }),
      };

      await room.connect(serverUrl, token, connectionConfig);

      console.log("🎤📹 Attempting to enable microphone and camera...");
      // Enable media with graceful fallback and simplified mobile handling
      try {
        // Simplified microphone settings to prevent crashes
        const micOptions = isMobile ?
          { echoCancellation: true, noiseSuppression: true } :
          { echoCancellation: true, noiseSuppression: true, autoGainControl: true };

        await room.localParticipant.setMicrophoneEnabled(true, micOptions);
        console.log("✅ Microphone enabled successfully");
      } catch (micError) {
        console.warn("⚠️ Could not enable microphone:", micError);
        // Try with basic settings if advanced ones fail
        try {
          await room.localParticipant.setMicrophoneEnabled(true);
          console.log("✅ Microphone enabled with basic settings");
        } catch (basicMicError) {
          console.error("❌ Failed to enable microphone with basic settings:", basicMicError);
        }
      }

      try {
        const cameraConstraints = isMobile ?
          { resolution: { width: 640, height: 480, frameRate: 15 } } :
          { resolution: { width: 1280, height: 720, frameRate: 30 } };

        await room.localParticipant.setCameraEnabled(true, cameraConstraints);
        console.log("✅ Camera enabled successfully");
      } catch (camError) {
        console.warn("⚠️ Could not enable camera:", camError);
      }

      console.log("✅ Room connection completed (media may be limited)");

    } catch (err: unknown) {
      console.error("💥 Connection failed:", err);
      isConnectingRef.current = false;

      // Provide mobile-specific error messages
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const error = err as Error;
      let errorMessage = error.message || "Failed to connect to room";

      if (isMobile) {
        if (error.message?.includes('websocket') || error.message?.includes('network')) {
          errorMessage = "Mobile connection issue detected. Please check your internet connection and try again.";
        } else if (error.message?.includes('media') || error.message?.includes('camera') || error.message?.includes('microphone')) {
          errorMessage = "Camera or microphone access failed. Please check permissions and try again.";
        }
      }

      onError(errorMessage);
      onConnectionChange(false, false);
    }
  }, [room, searchParams, onConnectionChange, onError, onJobDataUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return "Are you sure you want to leave? This will end the interview.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      room.disconnect();
    };
  }, [room]);

  return { connectToRoom };
}