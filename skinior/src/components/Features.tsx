"use client";

import React from "react";
import WaitlistButton from "./ui/WaitlistButton";
import { useTranslations, useLocale } from "next-intl";

const Features = () => {
  const t = useTranslations("features");
  const locale = useLocale();

  return (
    <section
      className="py-16 sm:py-24 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`max-w-lg ${locale === "ar" ? "lg:order-2" : ""}`}>
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
                  ? "تتميز منصة سكينيور بقدرتها على إنشاء روتين ذكي يتكيف مع احتياجات بشرتك المتغيرة ويتطور معك بمرور الوقت. هذا النهج المبتكر يضمن أن روتين العناية بالبشرة الخاص بك لا يبقى ثابتاً، بل يتحسن باستمرار ليواكب تطور حالة بشرتك وتغير ظروف حياتك."
                  : "Skinior features intelligent routines that seamlessly adapt to your changing skin needs and evolve with you over time. This innovative approach ensures that your skincare routine doesn't remain static, but continuously improves to match your skin's evolution and changing life circumstances."}
              </p>

              <p className="mb-6">
                {locale === "ar"
                  ? "باستخدام تقنيات الذكاء الاصطناعي المتقدمة، تقوم المنصة بإجراء تحليل شامل ودقيق لبشرتك لفهم احتياجاتك الفريدة ومخاوفك الجمالية. هذا التحليل العميق يمكّن النظام من تقديم حلول مخصصة تماماً لنوع بشرتك ومشاكلها الخاصة."
                  : "Through advanced artificial intelligence technology, the platform conducts comprehensive and precise skin analysis to understand your unique needs and aesthetic concerns. This deep analysis enables the system to provide completely customized solutions tailored to your specific skin type and individual concerns."}
              </p>

              <p className="mb-8">
                {locale === "ar"
                  ? "تتجاوز التوصيات المقدمة من سكينيور مجرد نوع البشرة، لتأخذ في الاعتبار نمط حياتك وبيئتك وأهدافك الشخصية في العناية بالبشرة. هذا النهج الشامل يضمن حصولك على خطة عناية متكاملة تتناسب مع ظروفك الحياتية وتحقق أهدافك الجمالية بأفضل طريقة ممكنة."
                  : "Skinior's recommendations go beyond simple skin type considerations, taking into account your lifestyle, environment, and personal skincare goals. This comprehensive approach ensures you receive an integrated care plan that fits your life circumstances and achieves your aesthetic goals in the most effective way possible."}
              </p>
            </div>

            <div className="mt-10">
              <WaitlistButton variant="primary" size="md" />
            </div>
          </div>

          <div
            className={`lg:pl-8 hidden md:block ${
              locale === "ar" ? "lg:order-1 lg:pr-8 lg:pl-0" : ""
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
                  ? "فيديو يعرض ميزات المنتج"
                  : "Product features demonstration video"
              }
            >
              <source src="/feature.webm" type="video/webm" />
              {locale === "ar"
                ? "متصفحك لا يدعم تشغيل الفيديو."
                : "Your browser does not support the video tag."}
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
