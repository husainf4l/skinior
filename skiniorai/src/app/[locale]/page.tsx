import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../i18n/routing";
import HeroSection from "../../components/HeroSection";
import TodaysDeals from "../../components/TodaysDeals";
import FeaturedProducts from "../../components/FeaturedProducts";
import ShopByCategory from "../../components/ShopByCategory";
import DealsSection from "../../components/DealsSection";

export const dynamic = "force-static";
export const revalidate = 3600; // Cache for 1 hour

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <TodaysDeals />
      <FeaturedProducts />
      <ShopByCategory />
      <DealsSection />
    </>
  );
}
