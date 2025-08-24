import dynamic from 'next/dynamic';

// Dynamic imports for LiveKit components to reduce initial bundle size
export const LiveKitRoom = dynamic(
  () => import('@livekit/components-react').then(mod => ({ default: mod.LiveKitRoom })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video call...</p>
        </div>
      </div>
    ),
  }
);

export const VideoConference = dynamic(
  () => import('@livekit/components-react').then(mod => ({ default: mod.VideoConference })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading conference...</p>
        </div>
      </div>
    ),
  }
);

export const ControlBar = dynamic(
  () => import('@livekit/components-react').then(mod => ({ default: mod.ControlBar })),
  {
    ssr: false,
  }
);

export const GridLayout = dynamic(
  () => import('@livekit/components-react').then(mod => ({ default: mod.GridLayout })),
  {
    ssr: false,
  }
);

export const ParticipantTile = dynamic(
  () => import('@livekit/components-react').then(mod => ({ default: mod.ParticipantTile })),
  {
    ssr: false,
  }
);

// For hooks, we'll export async functions that return the hooks
export const getLiveKitHooks = async () => {
  const mod = await import('@livekit/components-react');
  return {
    useRoomContext: mod.useRoomContext,
    useTracks: mod.useTracks,
  };
};

// Dynamic import for LiveKit client
export const getLiveKitClient = async () => {
  const mod = await import('livekit-client');
  return {
    Room: mod.Room,
    Track: mod.Track,
    LocalParticipant: mod.LocalParticipant,
  };
};
