"use client";

import { ReactNode } from "react";
import Script from "next/script";

export default function Room2Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Load OpenCV.js */}
      <Script
        src="https://docs.opencv.org/4.8.0/opencv.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("OpenCV.js loaded successfully for skin analysis");
        }}
        onError={(e) => {
          console.error("Failed to load OpenCV.js:", e);
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
