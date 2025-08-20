"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function RoomPage() {
  const router = useRouter();
  const locale = useLocale();
  
  useEffect(() => {
    // Redirect to room test page
    router.replace(`/${locale}/room-test`);
  }, [router, locale]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
