import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";

export const dynamic = "force-static";

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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