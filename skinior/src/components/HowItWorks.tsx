"use client";

import React from "react";
import WaitlistButton from "./ui/WaitlistButton";
import { useTranslations, useLocale } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("howItWorks");
  const locale = useLocale();

  return (
    <section
      className="py-16 sm:py-24 bg-gray-50"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className={`lg:pr-8 ${
              locale === "ar" ? "lg:order-2 lg:pl-8 lg:pr-0" : ""
            }`}
          >
            <video
              className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              aria-label={
                locale === "ar"
                  ? "فيديو يوضح كيف يعمل المنتج"
                  : "How Skinior works demonstration video"
              }
            >
              <source src="/works.webm" type="video/webm" />
              {locale === "ar"
                ? "متصفحك لا يدعم تشغيل الفيديو."
                : "Your browser does not support the video tag."}
            </video>
          </div>

          <div className={`max-w-lg ${locale === "ar" ? "lg:order-1" : ""}`}>
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">
                {t("subtitle")}
              </p>
              <h2
                className={`text-2xl md:text-3xl font-medium text-gray-900 mb-8 tracking-tight ${
                  locale === "ar" ? "font-arabic" : ""
                }`}
              >
                {t("title")}
              </h2>
            </div>

            <div
              className={`space-y-6 text-gray-700 leading-relaxed text-base ${
                locale === "ar" ? "font-arabic text-right" : ""
              }`}
            >
              <p className="mb-6">
                {locale === "ar"
                  ? "تبدأ رحلتك مع سكينيور بتحليل شامل ومتطور لبشرتك باستخدام أحدث تقنيات الذكاء الاصطناعي. هذا التحليل العميق يتجاوز مجرد النظر إلى سطح البشرة، ليفهم احتياجاتك الفريدة ويحدد المشاكل والتحديات التي تواجهها بشرتك بدقة متناهية."
                  : "Your journey with Skinior begins with a comprehensive and advanced skin analysis using the latest artificial intelligence technology. This deep analysis goes beyond just looking at the skin's surface, understanding your unique needs and precisely identifying the problems and challenges your skin faces."}
              </p>

              <p className="mb-6">
                {locale === "ar"
                  ? "بناءً على نتائج التحليل، تقوم المنصة بإنشاء روتين مخصص بالكامل يتكيف مع نمط حياتك اليومي وبيئتك المحيطة وأهدافك الشخصية في العناية بالبشرة. هذا الروتين ليس مجرد قائمة ثابتة من المنتجات، بل نظام ذكي يتطور ويتحسن مع مرور الوقت ليواكب تغيرات حياتك وبشرتك."
                  : "Based on the analysis results, the platform creates a completely personalized routine that adapts to your daily lifestyle, surrounding environment, and personal skincare goals. This routine isn't just a static list of products, but an intelligent system that evolves and improves over time to keep pace with changes in your life and skin."}
              </p>

              <p className="mb-8">
                {locale === "ar"
                  ? "النتيجة هي تحقيق نتائج مذهلة وملحوظة من خلال روتين يتطور ويتحسن باستمرار مع تقدم رحلتك في العناية بالبشرة. كلما استخدمت المنصة أكثر، كلما أصبحت التوصيات أكثر دقة وفعالية، مما يضمن لك الوصول إلى أفضل النتائج الممكنة."
                  : "The result is achieving amazing and noticeable results through a routine that continuously evolves and improves as your skincare journey progresses. The more you use the platform, the more accurate and effective the recommendations become, ensuring you achieve the best possible results."}
              </p>
            </div>

            <div className="mt-10">
              <WaitlistButton variant="primary" size="md">
                {locale === "ar"
                  ? "انضم إلى قائمة الانتظار"
                  : "Join Waiting List"}
              </WaitlistButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
