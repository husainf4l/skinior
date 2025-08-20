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
  searchParams?: { deals?: string };
}) {
  const { locale } = use(params);
  const isDealsPage = searchParams?.deals === "true";

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isDealsPage
          ? locale === "ar"
            ? "عروض خاصة لك"
            : "Deals for You"
          : locale === "ar"
          ? "المتجر"
          : "Shop"}
      </h1>
      <p className="text-gray-600">
        {isDealsPage
          ? locale === "ar"
            ? "لا تفوت عروضنا الحصرية والخصومات الخاصة على منتجات العناية بالبشرة المميزة"
            : "Don't miss out on our exclusive discounts and special offers on premium skincare products"
          : locale === "ar"
          ? "تسوق منتجات العناية بالبشرة عالية الجودة"
          : "Shop high-quality skincare products"}
      </p>

      {/* Client-side product list component */}
      <ShopProductList locale={locale} />
    </div>
  );
}
