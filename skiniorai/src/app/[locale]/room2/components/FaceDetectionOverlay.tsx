import React from "react";

interface FaceDetectionOverlayProps {
  faceDetected: boolean;
  isCapturing: boolean;
  isAnalyzing: boolean;
}

export function FaceDetectionOverlay({
  faceDetected,
  isCapturing,
  isAnalyzing,
}: FaceDetectionOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Face Detection Guide */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative w-64 h-80 border-2 rounded-lg transition-all duration-300 ${
            faceDetected
              ? "border-green-400 shadow-lg shadow-green-400/30"
              : "border-yellow-400 shadow-lg shadow-yellow-400/30"
          }`}
        >
          {/* Corner guides */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>

          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-8 h-8 border-2 rounded-full transition-all duration-300 ${
                faceDetected ? "border-green-400" : "border-yellow-400"
              }`}
            >
              <div
                className={`w-full h-full rounded-full transition-all duration-300 ${
                  faceDetected ? "bg-green-400/30" : "bg-yellow-400/30"
                }`}
              ></div>
            </div>
          </div>

          {/* Face outline guide */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <svg
              width="80"
              height="100"
              viewBox="0 0 80 100"
              className={`transition-all duration-300 ${
                faceDetected ? "text-green-400" : "text-yellow-400"
              }`}
            >
              <ellipse
                cx="40"
                cy="35"
                rx="25"
                ry="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <circle cx="32" cy="30" r="2" fill="currentColor" />
              <circle cx="48" cy="30" r="2" fill="currentColor" />
              <path
                d="M35 45 Q40 50 45 45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Capture Animation */}
      {isCapturing && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center animate-pulse">
          <div className="bg-white rounded-lg p-6 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium text-gray-900">
                Capturing...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Animation */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analyzing Your Skin
            </h3>
            <p className="text-gray-600">AI is processing your skin data...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!faceDetected && !isCapturing && !isAnalyzing && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-center">
            <p className="text-sm">Position your face within the guide</p>
          </div>
        </div>
      )}
    </div>
  );
}
