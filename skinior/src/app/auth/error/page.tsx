"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthError() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
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
            <p className="text-gray-600">
              We couldn&apos;t complete your Google authentication. This might
              be due to:
            </p>
            <ul className="text-sm text-gray-500 text-left space-y-1">
              <li>• Network connection issues</li>
              <li>• Google service temporarily unavailable</li>
              <li>• Invalid or expired authorization</li>
            </ul>
            <p className="text-gray-600 text-sm">
              You&apos;ll be redirected to the login page in a few seconds, or
              you can{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-black font-medium hover:text-gray-800 underline"
              >
                go back now
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
