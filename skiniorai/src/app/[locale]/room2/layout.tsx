"use client";

import { ReactNode } from "react";
import Script from "next/script";

export default function Room2Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Load OpenCV.js with fallback */}
      <Script
        src="https://docs.opencv.org/4.8.0/opencv.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("✅ OpenCV.js loaded successfully for skin analysis");
        }}
        onError={(e) => {
          console.warn("⚠️ Failed to load OpenCV.js from CDN:", e);
          console.log("🔄 Will use simulated face detection as fallback");
        }}
      />

      {/* Load additional ML models if needed */}
      <Script
        id="opencv-models"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.openCVReady = false;
            function onOpenCvReady() {
              window.openCVReady = true;
              console.log('OpenCV is ready for face detection');
              // Initialize face detection models
              if (window.cv && window.cv.CascadeClassifier) {
                console.log('Face detection capabilities available');
              }
            }
            
            // Wait for OpenCV to be ready
            if (typeof cv !== 'undefined') {
              onOpenCvReady();
            } else {
              const checkCV = setInterval(() => {
                if (typeof cv !== 'undefined') {
                  clearInterval(checkCV);
                  onOpenCvReady();
                }
              }, 100);
            }
          `,
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50/30">
        {children}
      </div>
    </>
  );
}
