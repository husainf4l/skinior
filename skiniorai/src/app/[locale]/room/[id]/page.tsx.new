"use client";

import dynamic from "next/dynamic";

// Dynamically import the room page to defer LiveKit loading
const DynamicRoomPage = dynamic(
  () => import("./RoomPageContent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Video Room</h2>
          <p className="text-gray-600">Preparing your video consultation...</p>
        </div>
      </div>
    ),
  }
);

interface RoomProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function Room(props: RoomProps) {
  return <DynamicRoomPage {...props} />;
}
