"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { productsService } from "@/services/productsService";
import { type Product } from "@/types/product";
import Link from "next/link";

const DealsSection = memo(() => {
  const t = useTranslations();
  const locale = useLocale();
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isRTL = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchDiscountedProducts = async () => {
      try {
        const data = await productsService.getDiscountedProducts();
        setDiscountedProducts(data);
      } catch (err) {
        console.error("Error fetching discounted products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, [mounted]);

  // Don't render anything until mounted or if no products
  if (!mounted || loading || discountedProducts.length === 0) {
    return null;
  }

  return (
    <section
      className={`py-24 bg-gray-50/50 ${isRTL ? "rtl font-cairo" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Apple-style Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide">
              {t("dealsForYou.title")}
            </span>
          </div>
          <p
            className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("dealsForYou.subtitle")}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {discountedProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Apple-style CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}/shop?deals=true`}
            className={`inline-flex items-center justify-center bg-black text-white hover:bg-gray-900 px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:scale-105 ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("dealsForYou.viewAll")}
            <svg
              className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
});

DealsSection.displayName = "DealsSection";

export default DealsSection;
