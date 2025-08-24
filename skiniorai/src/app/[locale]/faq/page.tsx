import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import type { Metadata } from "next";
import Breadcrumb from "../../../components/SEO/Breadcrumb";
import FeaturedSnippet from "../../../components/SEO/FeaturedSnippet";
import FAQStructuredData from "../../../components/SEO/FAQStructuredData";
import LocalSEO, { jordanKeywords } from "../../../components/SEO/LocalSEO";

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata for FAQ page SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRTL = locale === "ar";

  const title = isRTL
    ? "الأسئلة الشائعة - سكينيور | العناية بالبشرة"
    : "Frequently Asked Questions - Skinior | Skincare FAQ";

  const description = isRTL
    ? "احصل على إجابات لجميع أسئلتك حول منتجات العناية بالبشرة، الشحن، الإرجاع، وخدمات سكينيور. دليل شامل للأسئلة الشائعة"
    : "Get answers to all your questions about skincare products, shipping, returns, and Skinior services. Complete FAQ guide for all your concerns";

  const localKeywords = jordanKeywords[locale as keyof typeof jordanKeywords];
  const keywords = isRTL
    ? `أسئلة شائعة, العناية بالبشرة, سكينيور, مساعدة العملاء, دعم فني, ${
        localKeywords?.skincare || ""
      }`
    : `FAQ, frequently asked questions, skincare help, Skinior support, customer service, ${
        localKeywords?.skincare || ""
      }`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";
  const faqUrl = `${baseUrl}/${locale}/faq`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Skinior Team" }],
    creator: "Skinior",
    publisher: "Skinior",
    category: "Support",
    metadataBase: new URL(baseUrl),

    openGraph: {
      title,
      description,
      url: faqUrl,
      siteName: "Skinior",
      images: [
        {
          url: "/hero/hero1.webp",
          width: 1200,
          height: 630,
          alt: title,
          type: "image/webp",
        },
      ],
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/hero/hero1.webp"],
      site: "@skinior",
      creator: "@skinior",
    },

    alternates: {
      canonical: faqUrl,
      languages: {
        en: `${baseUrl}/en/faq`,
        ar: `${baseUrl}/ar/faq`,
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Comprehensive FAQ data organized by categories
const faqData = {
  en: {
    categories: [
      {
        title: "Products & Shopping",
        faqs: [
          {
            question: "What skincare products do you offer?",
            answer:
              "We offer a comprehensive range of premium skincare products including cleansers, serums, moisturizers, sunscreens, and specialized treatments for various skin types and concerns. All products are carefully selected for their effectiveness and safety.",
          },
          {
            question: "How do I choose the right products for my skin type?",
            answer:
              "Use our AI-powered skin analysis tool to get personalized product recommendations based on your unique skin needs, concerns, and goals. Our system analyzes your skin condition and suggests the most suitable products from our curated collection.",
          },
          {
            question: "Are your products suitable for sensitive skin?",
            answer:
              "Yes, we carry products specifically formulated for sensitive skin. Look for our sensitive skin collection or consult with our skincare experts for personalized recommendations. All sensitive skin products are hypoallergenic and dermatologist-tested.",
          },
          {
            question: "Do you offer organic or natural products?",
            answer:
              "Yes, we have a dedicated collection of organic and natural skincare products made with clean, sustainable ingredients. These products are free from harsh chemicals and are environmentally friendly.",
          },
        ],
      },
      {
        title: "Shipping & Delivery",
        faqs: [
          {
            question: "Do you offer international shipping?",
            answer:
              "Currently, we offer shipping throughout Jordan with plans to expand to other Middle Eastern countries soon. Check our shipping page for the latest delivery areas and estimated delivery times.",
          },
          {
            question: "How long does shipping take?",
            answer:
              "Standard shipping within Jordan takes 1-3 business days. Express delivery is available for same-day or next-day delivery in Amman. Shipping times may vary during peak seasons.",
          },
          {
            question: "What are the shipping costs?",
            answer:
              "Shipping is free for orders over JOD 50. For orders under JOD 50, standard shipping costs JOD 3. Express delivery has additional charges that vary by location.",
          },
        ],
      },
      {
        title: "Returns & Exchanges",
        faqs: [
          {
            question: "What is your return policy?",
            answer:
              "We offer a 30-day return policy for unopened products in original packaging. If you're not satisfied with your purchase, contact our customer service team within 30 days of delivery for assistance.",
          },
          {
            question: "How do I return a product?",
            answer:
              "Contact our customer service team to initiate a return. We'll provide you with a return authorization number and shipping instructions. Returns are free for defective products or our errors.",
          },
          {
            question:
              "Can I exchange a product for a different size or variant?",
            answer:
              "Yes, exchanges are possible within 30 days if the product is unopened and in original condition. Contact our team to arrange an exchange for a different size, color, or variant.",
          },
        ],
      },
      {
        title: "AI Skin Analysis",
        faqs: [
          {
            question: "How does the AI skin analysis work?",
            answer:
              "Our AI skin analysis uses advanced computer vision and machine learning algorithms to analyze your skin condition from photos. It identifies skin type, concerns, and provides personalized product recommendations.",
          },
          {
            question: "Is the AI skin analysis accurate?",
            answer:
              "Our AI system has been trained on thousands of skin images and validated by dermatologists. While highly accurate, it's designed to complement, not replace, professional dermatological advice.",
          },
          {
            question: "Is my skin analysis data private and secure?",
            answer:
              "Absolutely. We take privacy seriously. Your skin analysis data is encrypted, stored securely, and never shared with third parties. You can delete your data at any time through your account settings.",
          },
        ],
      },
      {
        title: "Account & Orders",
        faqs: [
          {
            question: "How do I create an account?",
            answer:
              "Click 'Sign Up' at the top of our website and provide your email address and basic information. You'll receive a verification email to activate your account and start shopping.",
          },
          {
            question: "How can I track my order?",
            answer:
              "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order status in your account dashboard under 'My Orders'.",
          },
          {
            question: "Can I modify or cancel my order?",
            answer:
              "You can modify or cancel your order within 1 hour of placement. After that, contact our customer service team as quickly as possible, and we'll do our best to accommodate changes before shipping.",
          },
        ],
      },
    ],
  },
  ar: {
    categories: [
      {
        title: "المنتجات والتسوق",
        faqs: [
          {
            question: "ما هي منتجات العناية بالبشرة التي تقدمونها؟",
            answer:
              "نقدم مجموعة شاملة من منتجات العناية بالبشرة الفاخرة تشمل منظفات، أمصال، مرطبات، واقيات الشمس، وعلاجات متخصصة لمختلف أنواع البشرة والمشاكل. جميع المنتجات مختارة بعناية لفعاليتها وأمانها.",
          },
          {
            question: "كيف أختار المنتجات المناسبة لنوع بشرتي؟",
            answer:
              "استخدم أداة تحليل البشرة المدعومة بالذكاء الاصطناعي للحصول على توصيات شخصية للمنتجات بناءً على احتياجات بشرتك الفريدة ومشاكلها وأهدافها. يحلل نظامنا حالة بشرتك ويقترح المنتجات الأنسب من مجموعتنا المختارة.",
          },
          {
            question: "هل منتجاتكم مناسبة للبشرة الحساسة؟",
            answer:
              "نعم، نحمل منتجات مصممة خصيصاً للبشرة الحساسة. ابحث عن مجموعة البشرة الحساسة أو استشر خبراء العناية بالبشرة لدينا للحصول على توصيات شخصية. جميع منتجات البشرة الحساسة مضادة للحساسية ومختبرة من قبل أطباء الجلدية.",
          },
          {
            question: "هل تقدمون منتجات عضوية أو طبيعية؟",
            answer:
              "نعم، لدينا مجموعة مخصصة من منتجات العناية بالبشرة العضوية والطبيعية المصنوعة من مكونات نظيفة ومستدامة. هذه المنتجات خالية من الكيماويات القاسية وصديقة للبيئة.",
          },
        ],
      },
      {
        title: "الشحن والتوصيل",
        faqs: [
          {
            question: "هل تقدمون شحن دولي؟",
            answer:
              "حالياً، نقدم الشحن في جميع أنحاء الأردن مع خطط للتوسع إلى دول الشرق الأوسط الأخرى قريباً. تحقق من صفحة الشحن للاطلاع على أحدث مناطق التوصيل وأوقات التسليم المتوقعة.",
          },
          {
            question: "كم تستغرق مدة الشحن؟",
            answer:
              "الشحن العادي داخل الأردن يستغرق 1-3 أيام عمل. التوصيل السريع متاح للتسليم في نفس اليوم أو اليوم التالي في عمان. قد تختلف أوقات الشحن خلال المواسم المزدحمة.",
          },
          {
            question: "ما هي تكاليف الشحن؟",
            answer:
              "الشحن مجاني للطلبات التي تزيد عن 50 دينار أردني. للطلبات أقل من 50 دينار، يبلغ الشحن العادي 3 دنانير. التوصيل السريع له رسوم إضافية تختلف حسب الموقع.",
          },
        ],
      },
      {
        title: "الإرجاع والاستبدال",
        faqs: [
          {
            question: "ما هي سياسة الإرجاع لديكم؟",
            answer:
              "نقدم سياسة إرجاع لمدة 30 يوماً للمنتجات غير المفتوحة في العبوة الأصلية. إذا لم تكن راضياً عن مشترياتك، اتصل بفريق خدمة العملاء خلال 30 يوماً من التسليم للمساعدة.",
          },
          {
            question: "كيف يمكنني إرجاع منتج؟",
            answer:
              "اتصل بفريق خدمة العملاء لبدء عملية الإرجاع. سنزودك برقم تفويض الإرجاع وتعليمات الشحن. الإرجاع مجاني للمنتجات المعيبة أو أخطائنا.",
          },
          {
            question: "هل يمكنني استبدال منتج بحجم أو نوع مختلف؟",
            answer:
              "نعم، الاستبدال ممكن خلال 30 يوماً إذا كان المنتج غير مفتوح وفي حالته الأصلية. اتصل بفريقنا لترتيب استبدال بحجم أو لون أو نوع مختلف.",
          },
        ],
      },
      {
        title: "تحليل البشرة بالذكاء الاصطناعي",
        faqs: [
          {
            question: "كيف يعمل تحليل البشرة بالذكاء الاصطناعي؟",
            answer:
              "يستخدم تحليل البشرة بالذكاء الاصطناعي خوارزميات الرؤية الحاسوبية والتعلم الآلي المتقدمة لتحليل حالة بشرتك من الصور. يحدد نوع البشرة والمشاكل ويقدم توصيات منتجات شخصية.",
          },
          {
            question: "هل تحليل البشرة بالذكاء الاصطناعي دقيق؟",
            answer:
              "تم تدريب نظام الذكاء الاصطناعي لدينا على آلاف صور البشرة وتم التحقق منه من قبل أطباء الجلدية. رغم دقته العالية، فهو مصمم ليكمل وليس يحل محل النصائح الطبية المتخصصة.",
          },
          {
            question: "هل بيانات تحليل بشرتي خاصة وآمنة؟",
            answer:
              "بالطبع. نحن نأخذ الخصوصية على محمل الجد. بيانات تحليل بشرتك مشفرة ومحفوظة بأمان ولا تُشارك مع أطراف ثالثة أبداً. يمكنك حذف بياناتك في أي وقت من إعدادات حسابك.",
          },
        ],
      },
      {
        title: "الحساب والطلبات",
        faqs: [
          {
            question: "كيف أنشئ حساباً؟",
            answer:
              "انقر على 'اشتراك' في أعلى موقعنا وقدم عنوان بريدك الإلكتروني والمعلومات الأساسية. ستتلقى بريد تأكيد إلكتروني لتفعيل حسابك وبدء التسوق.",
          },
          {
            question: "كيف يمكنني تتبع طلبي؟",
            answer:
              "بمجرد شحن طلبك، ستتلقى رقم تتبع عبر البريد الإلكتروني والرسائل النصية. يمكنك أيضاً تتبع حالة طلبك في لوحة حسابك تحت 'طلباتي'.",
          },
          {
            question: "هل يمكنني تعديل أو إلغاء طلبي؟",
            answer:
              "يمكنك تعديل أو إلغاء طلبك خلال ساعة واحدة من الطلب. بعد ذلك، اتصل بفريق خدمة العملاء في أسرع وقت ممكن، وسنبذل قصارى جهدنا لاستيعاب التغييرات قبل الشحن.",
          },
        ],
      },
    ],
  },
};

export default function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isRTL = locale === "ar";

  // Enable static rendering
  setRequestLocale(locale);

  const faqContent = faqData[locale as keyof typeof faqData];

  // Flatten all FAQs for structured data
  const allFAQs = faqContent.categories.flatMap((category) => category.faqs);

  return (
    <>
      <div
        className={`min-h-screen bg-gray-50 ${
          isRTL ? "rtl font-cairo" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 text-center">
              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-6 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h1>
              <p
                className={`text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "احصل على إجابات لجميع أسئلتك حول منتجاتنا وخدماتنا"
                  : "Get answers to all your questions about our products and services"}
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              {
                name: isRTL ? "الرئيسية" : "Home",
                href: `/${locale}`,
              },
              {
                name: isRTL ? "الأسئلة الشائعة" : "FAQ",
              },
            ]}
            className="mb-12"
          />

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqContent.categories.map((category, categoryIndex) => (
              <section
                key={categoryIndex}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
                  <h2
                    className={`text-2xl font-bold text-gray-900 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {category.faqs.map((faq, faqIndex) => (
                    <FeaturedSnippet
                      key={faqIndex}
                      question={faq.question}
                      answer={faq.answer}
                      locale={locale}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Support Section */}
          <section className="mt-16 bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
            <div className="max-w-2xl mx-auto">
              <h3
                className={`text-2xl font-bold text-gray-900 mb-4 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "لم تجد إجابة لسؤالك؟"
                  : "Didn't find what you're looking for?"}
              </h3>
              <p className={`text-gray-600 mb-6 ${isRTL ? "font-cairo" : ""}`}>
                {isRTL
                  ? "فريق دعم العملاء لدينا هنا لمساعدتك. تواصل معنا للحصول على مساعدة شخصية"
                  : "Our customer support team is here to help. Contact us for personalized assistance"}
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
              >
                <a
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  {isRTL ? "تواصل معنا" : "Contact Us"}
                </a>
                <a
                  href="mailto:support@skinior.com"
                  className="inline-flex items-center justify-center bg-white text-blue-600 border border-blue-200 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                >
                  {isRTL ? "إرسال بريد إلكتروني" : "Send Email"}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* FAQ Structured Data */}
      <FAQStructuredData faqs={allFAQs} />

      {/* Local SEO */}
      <LocalSEO locale={locale} />
    </>
  );
}
