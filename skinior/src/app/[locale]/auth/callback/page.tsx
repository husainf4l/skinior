"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useTranslations } from "next-intl";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const t = useTranslations("auth");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if this is a Google token callback
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage(t("authFailedMessage"));
          setTimeout(() => router.push(`/${locale}/login`), 3000);
          return;
        }

        if (!token || !refreshToken) {
          setStatus("error");
          setMessage(t("invalidResponse"));
          setTimeout(() => router.push(`/${locale}/login`), 3000);
          return;
        }

        // Handle traditional OAuth callback (if still used)
        authService.saveTokens({ accessToken: token, refreshToken });
        const user = await authService.getProfile();

        setStatus("success");
        setMessage(`${t("welcomeBack")}, ${user.firstName}!`);
        setTimeout(() => router.push(`/${locale}/dashboard`), 2000);
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage(t("authError"));
        setTimeout(() => router.push(`/${locale}/login`), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, t, locale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t("completingAuth")}
              </h2>
              <p className="text-gray-600">{t("authSetup")}</p>
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
                {t("authSuccess")}
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                {t("redirectingDashboard")}
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
                {t("authFailed")}
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">{t("redirectingLogin")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
