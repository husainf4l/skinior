import React from "react";
import { DashboardService } from "@/services/dashboardService";

interface DashboardTestProps {
  className?: string;
}

export const DashboardApiTest: React.FC<DashboardTestProps> = ({
  className = "",
}) => {
  const [testResults, setTestResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const runApiTests = async () => {
    setLoading(true);
    const results: any[] = [];

    // Test Dashboard Overview
    try {
      const overview = await DashboardService.getDashboardOverview("7d");
      results.push({
        test: "Dashboard Overview (7d)",
        status: "success",
        data: overview,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      results.push({
        test: "Dashboard Overview (7d)",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
    }

    // Test Treatments
    try {
      const treatments = await DashboardService.getTreatments();
      results.push({
        test: "Get Treatments",
        status: "success",
        data: treatments,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      results.push({
        test: "Get Treatments",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
    }

    // Test Consultations
    try {
      const consultations = await DashboardService.getConsultations(5);
      results.push({
        test: "Get Consultations",
        status: "success",
        data: consultations,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      results.push({
        test: "Get Consultations",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Dashboard API Test
        </h3>
        <button
          onClick={runApiTests}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Testing..." : "Run API Tests"}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.status === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4
                  className={`font-medium ${
                    result.status === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {result.test}
                </h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    result.status === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.status}
                </span>
              </div>

              {result.error && (
                <p className="text-sm text-red-600 mb-2">{result.error}</p>
              )}

              {result.data && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                    View Response Data
                  </summary>
                  <pre className="mt-2 p-2 bg-white rounded border overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}

              <p className="text-xs text-gray-500 mt-1">
                {new Date(result.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {testResults.length === 0 && !loading && (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p className="text-gray-500">
            Click "Run API Tests" to test the dashboard endpoints
          </p>
        </div>
      )}
    </div>
  );
};
