"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface NewsArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

const NewsArticlePage = ({ params }: NewsArticlePageProps) => {
  const router = useRouter();

  React.useEffect(() => {
    // Since we don't have any news articles yet, redirect to the main news page
    router.push("/news");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="text-6xl mb-6">🔄</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-600">Taking you back to the news page.</p>
      </div>
    </div>
  );
};

export default NewsArticlePage;
