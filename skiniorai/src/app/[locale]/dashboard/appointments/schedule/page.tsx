"use client";

import React from "react";
import { useLocale } from "next-intl";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function SchedulePage() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <DashboardLayout>
      <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-3xl font-bold text-gray-900 mb-6 ${isRTL ? "font-cairo" : ""}`}>
            {isRTL ? ",/HD) 'DEH'9J/" : "Schedule Appointments"}
          </h1>
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600">
              {isRTL ? "5A-) ,/HD) 'DEH'9J/ BJ/ 'D*7HJ1" : "Schedule appointments page is under development"}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}