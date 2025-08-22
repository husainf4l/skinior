import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";

// Import the client-side product list directly (relative path)
import ShopProductList from "../../../components/ShopProductList";

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
        {/* Client-side product list component */}
        <ShopProductList locale={locale} />
      </div>
    </div>
  );
}
