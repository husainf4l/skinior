import React from "react";
import { useRouter } from "next/navigation";

interface SkinAnalysisHeaderProps {
  userId?: string;
  roomId: string;
  isAnalyzing: boolean;
}

export function SkinAnalysisHeader({
  userId,
  roomId,
  isAnalyzing,
}: SkinAnalysisHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isAnalyzing}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Title and Status */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              AI Skin Analysis
            </h1>
            <p className="text-sm text-gray-600">
              {isAnalyzing
                ? "Analyzing your skin..."
                : "Position your face for analysis"}
            </p>
          </div>
        </div>

        {/* Analysis Status Indicator */}
        <div className="flex items-center space-x-4">
          {isAnalyzing && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-600 font-medium">
                Processing
              </span>
            </div>
          )}

          {/* Room Info */}
          <div className="text-right">
            <div className="text-xs text-gray-500">Room ID</div>
            <div className="text-sm font-mono text-gray-700">{roomId}</div>
          </div>

          {/* Help Button */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
