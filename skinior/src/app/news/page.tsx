"use client";

import React, { useState } from "react";

const NewsPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4008";

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/waitlist/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to subscribe");
      }

      const result = await response.json();
      console.log("Newsletter subscription successful:", result);
      setIsSuccess(true);
      setMessage("🎉 You're subscribed! We'll keep you updated.");

      // Reset form
      setEmail("");

      // Reset success state after delay
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
      }, 5000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4 tracking-tight">
            News & Updates
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay tuned for the latest news and updates about Skinior.
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-12">
          <div className="text-6xl mb-6">📰</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            We&apos;re working on bringing you the latest news, updates, and
            insights about skincare technology and Skinior developments. Check
            back soon for exciting announcements!
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Be the first to know when we publish new content.
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="bg-white text-black font-medium py-3 px-6 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Subscribing...
                  </div>
                ) : isSuccess ? (
                  "✓ Subscribed!"
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  isSuccess
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
