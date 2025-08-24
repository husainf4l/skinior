"use client";

interface Review {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  verified?: boolean;
}

interface ReviewStructuredDataProps {
  reviews: Review[];
  productName: string;
  averageRating: number;
  totalReviews: number;
  locale?: string;
}

export default function ReviewStructuredData(props: ReviewStructuredDataProps) {
  const {
    reviews,
    productName,
    averageRating,
    totalReviews,
  } = props;

  if (!reviews || reviews.length === 0) return null;

  // No helper needed in main component

  const generateReviewStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productName,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating,
        reviewCount: totalReviews,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: review.reviewBody,
        datePublished: review.datePublished,
        ...(review.verified && { reviewAspect: "verified purchase" }),
      })),
    };
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateReviewStructuredData()),
      }}
    />
  );
}

// Example usage component for when you add reviews later
export function ProductReviewSchema({
  productName,
  locale = "en",
}: {
  productName: string;
  locale?: string;
}) {
  // Ensure locale is used for language-specific content
  const getLocalizedText = (arText: string, enText: string) =>
    locale === "ar" ? arText : enText;

  // This would be replaced with actual review data from your API
  const mockReviews = [
    {
      author: "Sarah Ahmed",
      rating: 5,
      reviewBody: getLocalizedText(
        "منتج رائع! لاحظت تحسناً كبيراً في نعومة بشرتي بعد أسبوع من الاستخدام",
        "Amazing product! I noticed significant improvement in my skin texture after just one week of use."
      ),
      datePublished: "2024-01-15",
      verified: true,
    },
    {
      author: "Omar Hassan",
      rating: 4,
      reviewBody: getLocalizedText(
        "جودة ممتازة وتوصيل سريع. أنصح به بشدة",
        "Excellent quality and fast delivery. Highly recommend!"
      ),
      datePublished: "2024-01-10",
      verified: true,
    },
  ];

  return (
    <ReviewStructuredData
      reviews={mockReviews}
      productName={productName}
      averageRating={4.5}
      totalReviews={mockReviews.length}
      locale={locale}
    />
  );
}
