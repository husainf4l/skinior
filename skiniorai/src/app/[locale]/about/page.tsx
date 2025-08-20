import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import AboutPage from "./AboutPage";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 3600; // Cache for 1 hour

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: `${t("hero.title")} | Skinior`,
    description: t("hero.description"),
    keywords: [
      "AI skincare",
      "artificial intelligence beauty",
      "dermatologist consultation",
      "personalized skincare",
      "skin analysis technology",
      "beauty AI innovation",
      "clinical skin assessment",
      "skincare experts",
      "about skinior",
      "AI beauty platform",
      locale === "ar" ? "العناية بالبشرة" : "skincare company",
      locale === "ar" ? "الذكاء الاصطناعي" : "AI technology",
      locale === "ar" ? "تحليل البشرة" : "skin analysis",
    ].join(", "),
    authors: [{ name: "Skinior Team" }],
    creator: "Skinior",
    publisher: "Skinior",
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
    openGraph: {
      title: `${t("hero.title")} | Skinior`,
      description: t("hero.description"),
      url: `https://skinior.com/${locale}/about`,
      siteName: "Skinior",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: [
        {
          url: "/hero/hero1.webp",
          width: 1200,
          height: 630,
          alt: t("hero.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("hero.title")} | Skinior`,
      description: t("hero.description"),
      images: ["/hero/hero1.webp"],
      creator: "@skinior",
    },
    alternates: {
      canonical: `https://skinior.com/${locale}/about`,
      languages: {
        en: "https://skinior.com/en/about",
        ar: "https://skinior.com/ar/about",
      },
    },
  };
}

export default function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  return <AboutPage />;
}
