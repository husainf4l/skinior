import { useState, useCallback } from 'react';

export interface SkinAnalysisResults {
  overallScore: number;
  skinType: string;
  concerns: string[];
  texture: {
    score: number;
    description: string;
  };
  hydration: {
    score: number;
    description: string;
  };
  pigmentation: {
    score: number;
    description: string;
  };
  wrinkles: {
    score: number;
    description: string;
  };
  pores: {
    score: number;
    description: string;
  };
  recommendations: string[];
  capturedImage?: string;
  timestamp: Date;
}

interface SkinAnalysisState {
  isAnalyzing: boolean;
  isCapturing: boolean;
  faceDetected: boolean;
  analysisResults: SkinAnalysisResults | null;
  error: string | null;
  cameraActive: boolean;
  currentStep: 'positioning' | 'capturing' | 'analyzing' | 'results';
  captureCount: number;
  qualityScore: number;
}

export function useSkinAnalysisState() {
  const [state, setState] = useState<SkinAnalysisState>({
    isAnalyzing: false,
    isCapturing: false,
    faceDetected: false,
    analysisResults: null,
    error: null,
    cameraActive: false,
    currentStep: 'positioning',
    captureCount: 0,
    qualityScore: 0,
  });

  const updateAnalysisState = useCallback((updates: Partial<SkinAnalysisState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const updateResults = useCallback((results: SkinAnalysisResults) => {
    setState(prev => ({ 
      ...prev, 
      analysisResults: results,
      currentStep: 'results',
      isAnalyzing: false 
    }));
  }, []);

  const startCapture = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isCapturing: true,
      currentStep: 'capturing',
      captureCount: prev.captureCount + 1
    }));
  }, []);

  const startAnalysis = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true,
      isCapturing: false,
      currentStep: 'analyzing'
    }));
  }, []);

  const resetAnalysis = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isAnalyzing: false,
      isCapturing: false,
      analysisResults: null,
      currentStep: 'positioning',
      captureCount: 0,
      qualityScore: 0
    }));
  }, []);

  const updateFaceDetection = useCallback((detected: boolean, quality: number = 0) => {
    setState(prev => ({ 
      ...prev, 
      faceDetected: detected,
      qualityScore: quality
    }));
  }, []);

  return {
    ...state,
    updateAnalysisState,
    updateError,
    updateResults,
    startCapture,
    startAnalysis,
    resetAnalysis,
    updateFaceDetection,
  };
}
