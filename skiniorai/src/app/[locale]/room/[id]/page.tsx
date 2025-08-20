"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Room } from "livekit-client";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { InterviewLayout } from "../components/InterviewLayout";
import { useInterviewState } from "../hooks/useInterviewState";
import { useRoomConnection } from "../hooks/useRoomConnection";
import { useAuth } from "@/contexts/AuthContext";

interface RoomPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const searchParams = useSearchParams();
  const [room] = useState(() => new Room());
  const { user } = useAuth();
  
  const {
    isConnected,
    isConnecting,
    error,
    participantName,
    companyInfo,
    jobInfo,
    updateConnectionState,
    updateError,
    updateJobData,
  } = useInterviewState();

  const { connectToRoom } = useRoomConnection({
    room,
    searchParams,
    onConnectionChange: updateConnectionState,
    onError: updateError,
    onJobDataUpdate: updateJobData,
    userId: user?.id,
    roomId: params.id, // Pass the room ID from URL
  });

  // Auto-connect when component mounts
  useEffect(() => {
    if (!isConnected && !isConnecting && !error) {
      connectToRoom();
    }
  }, [isConnected, isConnecting, error, connectToRoom]);

  // Show loading or error states
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isConnecting || !isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to consultation room...</p>
        </div>
      </div>
    );
  }

  // Show main interview interface when connected
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      <LiveKitRoom room={room}>
        <InterviewLayout
          jobInfo={jobInfo}
          companyInfo={companyInfo}
          participantName={participantName}
        />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}