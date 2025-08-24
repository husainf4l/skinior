import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import type { Metadata } from "next";

// Import the client-side product list directly (relative path)
import ShopProductList from "../../../components/ShopProductList";
import Breadcrumb from "../../../components/SEO/Breadcrumb";
import LocalSEO, { jordanKeywords } from "../../../components/SEO/LocalSEO";


// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata for shop page SEO
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ deals?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isDealsPage = resolvedSearchParams?.deals === "true";
  const isRTL = locale === "ar";
  
  const title = isDealsPage
    ? isRTL 
      ? "عروض وخصومات خاصة - منتجات العناية بالبشرة | سكينيور"
      : "Special Deals & Discounts - Skincare Products | Skinior"
    : isRTL
      ? "متجر سكينيور - منتجات العناية بالبشرة الفاخرة"
      : "Skinior Shop - Premium Skincare Products";
    
  const description = isDealsPage
    ? isRTL
      ? "لا تفوت عروضنا الحصرية والخصومات الخاصة على منتجات العناية بالبشرة المميزة. وفر أكثر على منتجات التجميل الفاخرة من سكينيور"
      : "Don't miss our exclusive discounts and special offers on premium skincare products. Save more on luxury beauty products from Skinior"
    : isRTL
      ? "تسوق منتجات العناية بالبشرة عالية الجودة من سكينيور. كريمات، أمصال، ومنظفات طبيعية للعناية المثلى بجمال بشرتك"
      : "Shop high-quality skincare products from Skinior. Natural creams, serums, cleansers and treatments for optimal skin health and beauty";
  
  const localKeywords = jordanKeywords[locale as keyof typeof jordanKeywords];
  const keywords = isDealsPage
    ? isRTL
      ? `عروض, خصومات, منتجات التجميل, العناية بالبشرة, تخفيضات, سكينيور, ${localKeywords?.products || ''}`
      : `deals, discounts, beauty products, skincare offers, special prices, sale, Skinior, ${localKeywords?.products || ''}`
    : isRTL
      ? `متجر التجميل, منتجات العناية بالبشرة, كريمات, أمصال, منظفات, سكينيور, ${localKeywords?.shop || ''}`
      : `beauty shop, skincare products, creams, serums, cleansers, treatments, natural skincare, Skinior, ${localKeywords?.shop || ''}`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";
  const shopUrl = `${baseUrl}/${locale}/shop${isDealsPage ? "?deals=true" : ""}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Skinior Team" }],
    creator: "Skinior",
    publisher: "Skinior",
    category: "E-commerce",
    metadataBase: new URL(baseUrl),
    
    openGraph: {
      title,
      description,
      url: shopUrl,
      siteName: "Skinior",
      images: [
        {
          url: isDealsPage ? "/deals/special-offers.webp" : "/hero/hero1.webp",
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
      images: [isDealsPage ? "/deals/special-offers.webp" : "/hero/hero1.webp"],
      site: "@skinior",
      creator: "@skinior",
    },
    
    alternates: {
      canonical: shopUrl,
      languages: {
        en: `${baseUrl}/en/shop${isDealsPage ? "?deals=true" : ""}`,
        ar: `${baseUrl}/ar/shop${isDealsPage ? "?deals=true" : ""}`,
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
      "product:availability": "in stock",
      "product:condition": "new",
      "og:type": "product.group",
    },
  };
}

export default function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ deals?: string }>;
}) {
  const { locale } = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  const isDealsPage = resolvedSearchParams?.deals === "true";

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple-style hero section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 text-center shop-hero-animation">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-gray-900 mb-4 sm:mb-6 leading-tight ${locale === "ar" ? "font-cairo" : ""}`}>
              {isDealsPage
                ? locale === "ar"
                  ? "عروض خاصة لك"
                  : "Deals for You"
                : locale === "ar"
                ? "المتجر"
                : "Shop"}
            </h1>
            <p className={`text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 ${locale === "ar" ? "font-cairo" : ""}`}>
              {isDealsPage
                ? locale === "ar"
                  ? "لا تفوت عروضنا الحصرية والخصومات الخاصة على منتجات العناية بالبشرة المميزة"
                  : "Don't miss out on our exclusive discounts and special offers on premium skincare products"
                : locale === "ar"
                ? "تسوق منتجات العناية بالبشرة عالية الجودة"
                : "Shop high-quality skincare products"}
            </p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            {
              name: locale === "ar" ? "الرئيسية" : "Home",
              href: `/${locale}`
            },
            {
              name: isDealsPage 
                ? (locale === "ar" ? "العروض الخاصة" : "Special Deals")
                : (locale === "ar" ? "المتجر" : "Shop")
            }
          ]}
          className="mb-8"
        />
        
        {/* Client-side product list component */}
        <ShopProductList locale={locale} />
      </div>
      
      {/* Local SEO for Jordan */}
      <LocalSEO locale={locale} />
    </div>
  );
}
