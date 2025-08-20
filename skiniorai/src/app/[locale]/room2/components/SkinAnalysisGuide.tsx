import React from "react";

interface SkinAnalysisGuideProps {
  faceDetected: boolean;
  isAnalyzing: boolean;
  isCapturing: boolean;
}

export function SkinAnalysisGuide({
  faceDetected,
  isAnalyzing,
  isCapturing,
}: SkinAnalysisGuideProps) {
  const getCurrentStep = () => {
    if (isAnalyzing) return 3;
    if (isCapturing) return 2;
    if (faceDetected) return 1;
    return 0;
  };

  const currentStep = getCurrentStep();

  const steps = [
    {
      title: "Position Your Face",
      description: "Center your face within the guide and ensure good lighting",
      icon: "👤",
      active: currentStep === 0,
    },
    {
      title: "Hold Still",
      description: "Face detected! Click capture when ready",
      icon: "📸",
      active: currentStep === 1,
    },
    {
      title: "Capturing",
      description: "Taking high-resolution image of your skin",
      icon: "⚡",
      active: currentStep === 2,
    },
    {
      title: "AI Analysis",
      description: "Processing your skin data with advanced algorithms",
      icon: "🧠",
      active: currentStep === 3,
    },
  ];

  return (
    <div className="mt-8 w-full max-w-4xl">
      {/* Step Indicator */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                index <= currentStep
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {index < currentStep ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="text-xl">{step.icon}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  index < currentStep ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Current Step Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {steps[currentStep]?.title}
        </h3>
        <p className="text-gray-600 mb-4">{steps[currentStep]?.description}</p>

        {/* Tips based on current step */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
          {currentStep === 0 && (
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Remove glasses and hair from face</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Face the camera directly</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Ensure even, natural lighting</span>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">🎯</span>
                <span>Perfect! Face is properly positioned</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">📱</span>
                <span>Click the capture button when ready</span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">⏱️</span>
                <span>Hold still for best results</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">📷</span>
                <span>Capturing high-resolution image</span>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-purple-500">🔬</span>
                <span>Analyzing skin texture and tone</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-500">💧</span>
                <span>Measuring hydration levels</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-500">🎯</span>
                <span>Detecting areas of concern</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
