"use client";

import { useState, useCallback } from "react";
import { useLocale } from "next-intl";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

interface ReviewSystemProps {
  averageRating?: number;
  totalReviews?: number;
  reviews?: Review[];
  onSubmitReview?: (
    review: Omit<Review, "id" | "date" | "helpful">
  ) => Promise<void>;
}

export default function ReviewSystem({
  averageRating = 0,
  totalReviews = 0,
  reviews = [],
  onSubmitReview,
}: ReviewSystemProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    author: "",
    rating: 0,
    comment: "",
    verified: false,
    images: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = useCallback(async () => {
    if (!newReview.author || !newReview.comment || newReview.rating === 0)
      return;

    setSubmitting(true);
    try {
      await onSubmitReview?.({
        author: newReview.author,
        rating: newReview.rating,
        comment: newReview.comment,
        verified: newReview.verified,
        images: newReview.images,
      });

      // Reset form
      setNewReview({
        author: "",
        rating: 0,
        comment: "",
        verified: false,
        images: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  }, [newReview, onSubmitReview]);

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div
        className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            className={`${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${interactive ? "hover:text-yellow-400 cursor-pointer" : ""}`}
            onClick={
              interactive
                ? () => setNewReview((prev) => ({ ...prev, rating: star }))
                : undefined
            }
            disabled={!interactive}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      {/* Review Summary */}
      <div className="mb-8">
        <div
          className={`flex items-center gap-4 mb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating))}
          </div>
          <div
            className={`text-sm text-gray-600 ${
              isRTL ? "font-cairo text-right" : "text-left"
            }`}
          >
            {isRTL
              ? `استناداً إلى ${totalReviews} تقييم`
              : `Based on ${totalReviews} reviews`}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(
              (r) => Math.round(r.rating) === rating
            ).length;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div
                key={rating}
                className={`flex items-center gap-2 text-sm ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className={isRTL ? "font-cairo" : ""}>{rating}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className={`text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
                  ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
            isRTL ? "font-cairo" : ""
          }`}
        >
          {isRTL ? "اكتب تقييم" : "Write a Review"}
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <h3
            className={`text-lg font-semibold mb-4 ${
              isRTL ? "font-cairo text-right" : "text-left"
            }`}
          >
            {isRTL ? "اكتب تقييمك" : "Write Your Review"}
          </h3>

          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isRTL ? "font-cairo text-right" : "text-left"
                }`}
              >
                {isRTL ? "التقييم" : "Rating"}
              </label>
              {renderStars(newReview.rating, true)}
            </div>

            {/* Author Name */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isRTL ? "font-cairo text-right" : "text-left"
                }`}
              >
                {isRTL ? "الاسم" : "Name"}
              </label>
              <input
                type="text"
                value={newReview.author}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, author: e.target.value }))
                }
                className={`w-full p-3 border border-gray-300 rounded-lg ${
                  isRTL ? "font-cairo text-right" : "text-left"
                }`}
                placeholder={isRTL ? "أدخل اسمك" : "Enter your name"}
              />
            </div>

            {/* Comment */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isRTL ? "font-cairo text-right" : "text-left"
                }`}
              >
                {isRTL ? "التعليق" : "Review"}
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                rows={4}
                className={`w-full p-3 border border-gray-300 rounded-lg resize-none ${
                  isRTL ? "font-cairo text-right" : "text-left"
                }`}
                placeholder={
                  isRTL
                    ? "شاركنا تجربتك مع هذا المنتج"
                    : "Share your experience with this product"
                }
              />
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={handleSubmitReview}
                disabled={
                  submitting ||
                  !newReview.author ||
                  !newReview.comment ||
                  newReview.rating === 0
                }
                className={`flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {submitting
                  ? isRTL
                    ? "جاري النشر..."
                    : "Submitting..."
                  : isRTL
                  ? "نشر التقييم"
                  : "Submit Review"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3
            className={`text-lg font-semibold ${
              isRTL ? "font-cairo text-right" : "text-left"
            }`}
          >
            {isRTL ? "التقييمات" : "Reviews"}
          </h3>

          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div
                className={`flex items-start gap-4 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div
                    className={`flex items-center gap-2 mb-2 ${
                      isRTL ? "flex-row-reverse justify-start" : ""
                    }`}
                  >
                    <span
                      className={`font-medium ${isRTL ? "font-cairo" : ""}`}
                    >
                      {review.author}
                    </span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {isRTL ? "مشترٍ موثق" : "Verified Purchase"}
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-2 mb-2 ${
                      isRTL ? "flex-row-reverse justify-start" : ""
                    }`}
                  >
                    {renderStars(review.rating)}
                    <span
                      className={`text-sm text-gray-500 ${
                        isRTL ? "font-cairo" : ""
                      }`}
                    >
                      {new Date(review.date).toLocaleDateString(locale)}
                    </span>
                  </div>

                  <p
                    className={`text-gray-700 mb-2 ${
                      isRTL ? "font-cairo text-right" : "text-left"
                    }`}
                  >
                    {review.comment}
                  </p>

                  {review.helpful > 0 && (
                    <div
                      className={`text-sm text-gray-500 ${
                        isRTL ? "font-cairo text-right" : "text-left"
                      }`}
                    >
                      {review.helpful}{" "}
                      {isRTL
                        ? "شخص وجد هذا مفيداً"
                        : "people found this helpful"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export for easy integration
export { type Review };
