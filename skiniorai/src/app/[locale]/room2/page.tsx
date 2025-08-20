"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function Room2Page() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Generate a unique room ID for skin analysis session
    const roomId = `skin-analysis-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    // Redirect to the skin analysis room with the generated ID
    router.replace(`/${locale}/room2/${roomId}`);
  }, [router, locale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50/30 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Initializing Skin Analysis Room
        </h2>
        <p className="text-gray-600">
          Preparing your personalized skin analysis session...
        </p>
      </div>
    </div>
  );
}
