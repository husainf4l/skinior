"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { productsService } from "@/services/productsService";
import { type Product } from "@/types/product";
import Link from "next/link";

const FeaturedProducts = memo(() => {
  const t = useTranslations();
  const locale = useLocale();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRTL = locale === "ar";

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await productsService.getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []); // Remove locale dependency

  if (loading) {
    return (
      <section
        className={`py-16 bg-gray-50 ${isRTL ? "rtl font-cairo" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold text-gray-900 mb-4 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {t("featuredProducts.title")}
            </h2>
            <p
              className={`text-lg text-gray-600 max-w-2xl mx-auto ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {t("featuredProducts.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={`py-16 bg-gray-50 ${isRTL ? "rtl font-cairo" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold text-gray-900 mb-4 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {t("featuredProducts.title")}
            </h2>
            <p
              className={`text-lg text-red-600 max-w-2xl mx-auto ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isRTL ? "فشل في تحميل المنتجات المميزة" : error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-16 bg-gray-50 ${isRTL ? "rtl font-cairo" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl font-bold text-gray-900 mb-4 ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("featuredProducts.title")}
          </h2>
          <p
            className={`text-lg text-gray-600 max-w-2xl mx-auto ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("featuredProducts.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {featuredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/shop`}
            className={`inline-block bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full text-base font-medium transition-colors duration-200 ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("featuredProducts.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
});

FeaturedProducts.displayName = "FeaturedProducts";

export default FeaturedProducts;
