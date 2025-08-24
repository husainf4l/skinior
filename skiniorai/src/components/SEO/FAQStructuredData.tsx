"use client";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQ[];
}

export default function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  if (!faqs || faqs.length === 0) return null;

  const generateFAQStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateFAQStructuredData()),
      }}
    />
  );
}

// Common FAQ data for different pages
export const skincareFAQs = {
  en: [
    {
      question: "How does AI skin analysis work?",
      answer:
        "Our AI analyzes your skin photos using advanced computer vision to identify skin concerns, texture, and recommend personalized skincare products.",
    },
    {
      question: "Is the skin analysis accurate?",
      answer:
        "Yes, our AI is trained on thousands of dermatologist-validated images and provides highly accurate skin condition assessments.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 2-3 business days within Jordan. Express delivery is available for next-day delivery.",
    },
    {
      question: "Can I return products?",
      answer:
        "Yes, we offer a 30-day return policy for unopened products. Customer satisfaction is our priority.",
    },
  ],
  ar: [
    {
      question: "كيف يعمل تحليل البشرة بالذكاء الاصطناعي؟",
      answer:
        "يحلل الذكاء الاصطناعي صور بشرتك باستخدام تقنيات الرؤية المتقدمة لتحديد مشاكل البشرة والملمس وتوصية منتجات العناية المخصصة.",
    },
    {
      question: "هل تحليل البشرة دقيق؟",
      answer:
        "نعم، تم تدريب الذكاء الاصطناعي على آلاف الصور المعتمدة من أطباء الجلدية ويوفر تقييمات دقيقة جداً لحالة البشرة.",
    },
    {
      question: "كم تستغرق عملية التوصيل؟",
      answer:
        "التوصيل العادي يستغرق 2-3 أيام عمل داخل الأردن. التوصيل السريع متاح للتسليم في اليوم التالي.",
    },
    {
      question: "هل يمكنني إرجاع المنتجات؟",
      answer:
        "نعم، نوفر سياسة إرجاع لمدة 30 يوماً للمنتجات غير المفتوحة. رضا العملاء هو أولويتنا.",
    },
  ],
};
