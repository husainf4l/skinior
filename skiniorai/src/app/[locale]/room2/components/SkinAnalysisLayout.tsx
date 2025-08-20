import React, { useEffect, useRef } from 'react';
import { SkinAnalysisHeader } from './SkinAnalysisHeader';
import { FaceDetectionOverlay } from './FaceDetectionOverlay';
import { SkinAnalysisControls } from './SkinAnalysisControls';
import { SkinAnalysisResults } from './SkinAnalysisResults';
import { SkinAnalysisGuide } from './SkinAnalysisGuide';
import { OpenCVProcessor } from './OpenCVProcessor';
import { SkinAnalysisResults as AnalysisResults } from '../hooks/useSkinAnalysisState';

interface SkinAnalysisLayoutProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isAnalyzing: boolean;
  isCapturing: boolean;
  faceDetected: boolean;
  analysisResults: AnalysisResults | null;
  userId?: string;
  roomId: string;
  onCapture: () => void;
  processor: OpenCVProcessor | null;
}

export function SkinAnalysisLayout({
  videoRef,
  canvasRef,
  isAnalyzing,
  isCapturing,
  faceDetected,
  analysisResults,
  userId,
  roomId,
  onCapture,
  processor,
}: SkinAnalysisLayoutProps) {
  const processorRef = useRef<OpenCVProcessor | null>(null);

  useEffect(() => {
    // The processor is now passed as a prop, so we don't need to create it here
    processorRef.current = processor;
  }, [processor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50/30">
      {/* Header */}
      <SkinAnalysisHeader 
        userId={userId}
        roomId={roomId}
        isAnalyzing={isAnalyzing}
      />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-2xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            
            {/* Canvas for OpenCV Processing */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Face Detection Overlay */}
            <FaceDetectionOverlay 
              faceDetected={faceDetected}
              isCapturing={isCapturing}
              isAnalyzing={isAnalyzing}
            />

            {/* Quality Indicators */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                faceDetected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {faceDetected ? '✓ Face Detected' : '⚠ Position Your Face'}
              </div>
            </div>

            {/* Camera Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <SkinAnalysisControls
                processor={processorRef.current}
                faceDetected={faceDetected}
                isAnalyzing={isAnalyzing}
                isCapturing={isCapturing}
                onCapture={onCapture}
              />
            </div>
          </div>

          {/* Guide Section */}
          <SkinAnalysisGuide 
            faceDetected={faceDetected}
            isAnalyzing={isAnalyzing}
            isCapturing={isCapturing}
          />
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-96 bg-white/70 backdrop-blur-xl border-l border-white/20 overflow-y-auto">
          {analysisResults ? (
            <SkinAnalysisResults results={analysisResults} />
          ) : (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                AI Skin Analysis
              </h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    🎯 Perfect Positioning
                  </h4>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Face the camera directly</li>
                    <li>• Ensure good lighting</li>
                    <li>• Remove glasses if possible</li>
                    <li>• Keep face centered</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    🔬 Analysis Features
                  </h4>
                  <ul className="space-y-1 text-green-800">
                    <li>• Skin texture analysis</li>
                    <li>• Hydration assessment</li>
                    <li>• Pigmentation detection</li>
                    <li>• Wrinkle analysis</li>
                    <li>• Pore size evaluation</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
