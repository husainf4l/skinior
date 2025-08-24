import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import type { Metadata } from "next";

export const dynamic = "force-static";

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata for products listing page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRTL = locale === "ar";
  
  const title = isRTL 
    ? "منتجات العناية بالبشرة - سكينيور" 
    : "Skincare Products - Skinior";
    
  const description = isRTL
    ? "اكتشف مجموعتنا الواسعة من منتجات العناية بالبشرة الفاخرة. منتجات طبيعية وفعالة لجميع أنواع البشرة من سكينيور"
    : "Discover our premium collection of skincare products. Natural and effective formulas for all skin types from Skinior";
  
  const keywords = isRTL
    ? "منتجات العناية بالبشرة, مستحضرات التجميل, منتجات طبيعية, سكينيور"
    : "skincare products, cosmetics, natural products, beauty, anti-aging, moisturizer, cleanser, serum";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";
  const productsUrl = `${baseUrl}/${locale}/products`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    
    openGraph: {
      title,
      description,
      url: productsUrl,
      images: [
        {
          url: `${baseUrl}/hero/hero1.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      siteName: "Skinior",
    },
    
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/hero/hero1.webp`],
      site: "@skinior",
    },
    
    alternates: {
      canonical: productsUrl,
      languages: {
        en: `${baseUrl}/en/products`,
        ar: `${baseUrl}/ar/products`,
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

export default function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {locale === 'ar' ? 'المنتجات' : 'Products'}
      </h1>
      <p className="text-gray-600">
        {locale === 'ar' 
          ? 'استكشف مجموعتنا الكاملة من منتجات العناية بالبشرة'
          : 'Explore our complete collection of skincare products'
        }
      </p>
    </div>
  );
}