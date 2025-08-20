import React, { useState } from "react";
import { OpenCVProcessor } from "./OpenCVProcessor";

interface SkinAnalysisControlsProps {
  processor: OpenCVProcessor | null;
  faceDetected: boolean;
  isAnalyzing: boolean;
  isCapturing: boolean;
  onCapture: () => void;
}

export function SkinAnalysisControls({
  processor,
  faceDetected,
  isAnalyzing,
  isCapturing,
  onCapture,
}: SkinAnalysisControlsProps) {
  const [countdown, setCountdown] = useState(0);

  const handleCapture = async () => {
    if (!processor || !faceDetected || isAnalyzing || isCapturing) return;

    // Start countdown
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        clearInterval(countdownInterval);
        setCountdown(0);
        onCapture(); // Call the parent's capture handler
      }
    }, 1000);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Countdown Display */}
      {countdown > 0 && (
        <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-full">
          <span className="text-2xl font-bold">{countdown}</span>
        </div>
      )}

      {/* Capture Button */}
      <button
        onClick={handleCapture}
        disabled={!faceDetected || isAnalyzing || isCapturing || countdown > 0}
        className={`w-16 h-16 rounded-full border-4 transition-all duration-300 ${
          faceDetected && !isAnalyzing && !isCapturing && countdown === 0
            ? "bg-white border-green-400 hover:bg-green-50 hover:scale-110 shadow-lg shadow-green-400/30"
            : "bg-gray-300 border-gray-400 cursor-not-allowed"
        }`}
      >
        {isAnalyzing ? (
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          <svg
            className="w-8 h-8 mx-auto text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>

      {/* Quality Indicator */}
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          faceDetected
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {faceDetected ? "Ready to Analyze" : "Position Face"}
      </div>
    </div>
  );
}
