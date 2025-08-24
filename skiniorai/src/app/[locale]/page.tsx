import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../i18n/routing";
import HeroSection from "../../components/HeroSection";
import TodaysDeals from "../../components/TodaysDeals";
import FeaturedProducts from "../../components/FeaturedProducts";
import ShopByCategory from "../../components/ShopByCategory";
import DealsSection from "../../components/DealsSection";

import LocalSEO, { jordanKeywords } from "../../components/SEO/LocalSEO";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 3600; // Cache for 1 hour

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata for homepage SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRTL = locale === "ar";

  const title = isRTL
    ? "سكينيور - حلول العناية بالبشرة المتقدمة بالذكاء الاصطناعي"
    : "Skinior - Advanced AI-Powered Skincare Solutions";

  const description = isRTL
    ? "احصل على تحليل دقيق لبشرتك باستخدام الذكاء الاصطناعي وتوصيات مخصصة لمنتجات العناية بالبشرة. خدمة استشارات جلدية متقدمة مع أحدث التقنيات"
    : "Get precise AI skin analysis and personalized skincare product recommendations. Advanced dermatology consultations with cutting-edge technology for healthier, more radiant skin";

  const localKeywords = jordanKeywords[locale as keyof typeof jordanKeywords];
  const keywords = isRTL
    ? `سكينيور, العناية بالبشرة, الذكاء الاصطناعي, تحليل البشرة, منتجات التجميل, استشارات جلدية, العناية الشخصية, ${
        localKeywords?.skincare || ""
      }`
    : `Skinior, AI skincare, skin analysis, beauty products, dermatology consultation, personalized skincare, artificial intelligence, beauty technology, ${
        localKeywords?.skincare || ""
      }`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";
  const homeUrl = `${baseUrl}/${locale}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Skinior Team" }],
    creator: "Skinior",
    publisher: "Skinior",
    category: "Beauty & Health",
    metadataBase: new URL(baseUrl),

    openGraph: {
      title,
      description,
      url: homeUrl,
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
      canonical: homeUrl,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
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

    other: {
      "apple-mobile-web-app-title": "Skinior",
      "application-name": "Skinior",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
    },
  };
}

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isRTL = locale === "ar";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";

  // Enable static rendering
  setRequestLocale(locale);

  // Generate comprehensive homepage structured data
  const generateHomepageStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: isRTL ? "سكينيور" : "Skinior",
      alternateName: "Skinior AI Skincare",
      url: `${baseUrl}/${locale}`,
      description: isRTL
        ? "احصل على تحليل دقيق لبشرتك باستخدام الذكاء الاصطناعي وتوصيات مخصصة لمنتجات العناية بالبشرة"
        : "Get precise AI skin analysis and personalized skincare product recommendations with cutting-edge technology",
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/${locale}/shop?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
      sameAs: [
        "https://facebook.com/skinior",
        "https://twitter.com/skinior",
        "https://instagram.com/skinior",
      ],
      publisher: {
        "@type": "Organization",
        name: "Skinior",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logos/skinior-logo-black.png`,
          width: 200,
          height: 60,
        },
        description: isRTL
          ? "منصة العناية بالبشرة المدعومة بالذكاء الاصطناعي"
          : "AI-powered skincare analysis and consultation platform",
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["English", "Arabic"],
            areaServed: "JO",
          },
        ],
        areaServed: {
          "@type": "Country",
          name: "Jordan",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: isRTL ? "منتجات العناية بالبشرة" : "Skincare Products",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: isRTL
                  ? "تحليل البشرة بالذكاء الاصطناعي"
                  : "AI Skin Analysis",
                description: isRTL
                  ? "تحليل متقدم لحالة بشرتك باستخدام الذكاء الاصطناعي"
                  : "Advanced skin condition analysis using artificial intelligence",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: isRTL ? "استشارات جلدية" : "Dermatology Consultations",
                description: isRTL
                  ? "استشارات متخصصة مع خبراء الجلدية"
                  : "Expert dermatology consultations",
              },
            },
          ],
        },
      },
    };
  };

  return (
    <>
      {/* Homepage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomepageStructuredData()),
        }}
      />

      <HeroSection />
      <TodaysDeals />
      <FeaturedProducts />
      <ShopByCategory />
      <DealsSection />

  

      {/* Local SEO for Jordan */}
      <LocalSEO locale={locale} />
    </>
  );
}
