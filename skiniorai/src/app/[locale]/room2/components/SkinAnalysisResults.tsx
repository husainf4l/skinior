import React from "react";
import { SkinAnalysisResults as AnalysisResults } from "../hooks/useSkinAnalysisState";

interface SkinAnalysisResultsProps {
  results: AnalysisResults;
}

export function SkinAnalysisResults({ results }: SkinAnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return "😊";
    if (score >= 70) return "😐";
    return "😞";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Skin Analysis
        </h2>
        <p className="text-gray-600 text-sm">
          {results.timestamp.toLocaleDateString()} at{" "}
          {results.timestamp.toLocaleTimeString()}
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 text-center">
        <div className="text-4xl mb-2">
          {getScoreIcon(results.overallScore)}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {results.overallScore}/100
        </div>
        <div className="text-lg font-medium text-gray-700 mb-1">
          Overall Skin Health
        </div>
        <div className="text-sm text-gray-600">
          Skin Type: <span className="font-medium">{results.skinType}</span>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Detailed Analysis
        </h3>

        {[
          { label: "Texture", data: results.texture },
          { label: "Hydration", data: results.hydration },
          { label: "Pigmentation", data: results.pigmentation },
          { label: "Wrinkles", data: results.wrinkles },
          { label: "Pores", data: results.pores },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{item.label}</span>
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(
                  item.data.score
                )}`}
              >
                {item.data.score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${item.data.score}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{item.data.description}</p>
          </div>
        ))}
      </div>

      {/* Concerns */}
      {results.concerns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Areas of Concern
          </h3>
          <div className="space-y-2">
            {results.concerns.map((concern, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg"
              >
                <span className="text-orange-500">⚠️</span>
                <span className="text-orange-800 text-sm">{concern}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
        <div className="space-y-2">
          {results.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg"
            >
              <span className="text-green-500 mt-0.5">✨</span>
              <span className="text-green-800 text-sm">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Captured Image */}
      {results.capturedImage && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Captured Image
          </h3>
          <div className="relative">
            <img
              src={results.capturedImage}
              alt="Captured skin analysis"
              className="w-full rounded-lg border border-gray-200"
            />
            <div className="absolute top-2 right-2">
              <button className="bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-lg shadow-lg transition-all">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
          View Product Recommendations
        </button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors">
          Schedule Follow-up Analysis
        </button>
        <button className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-lg font-medium transition-colors">
          Share Results
        </button>
      </div>
    </div>
  );
}
