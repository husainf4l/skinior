"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage("Authentication failed. Please try again.");
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        if (!token || !refreshToken) {
          setStatus("error");
          setMessage("Invalid authentication response.");
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        // Save tokens
        authService.saveTokens({ accessToken: token, refreshToken });

        // Verify authentication by getting user profile
        const user = await authService.getProfile();

        setStatus("success");
        setMessage(`Welcome back, ${user.firstName}!`);

        // Redirect to dashboard after a short delay
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage("Failed to complete authentication. Please try again.");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-900">
                Completing Authentication...
              </h2>
              <p className="text-gray-600">
                Please wait while we set up your account.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Authentication Successful!
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting you to the dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Authentication Failed
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-900">
                Loading...
              </h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
