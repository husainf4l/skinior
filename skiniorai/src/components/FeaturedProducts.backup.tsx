"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
import Link from "next/link";

const FeaturedProducts = memo(() => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Temporary static products for testing
  const staticProducts = [
    {
      id: "1",
      title: "Vitamin C Serum",
      price: 45,
      images: [
        {
          url: "https://placehold.co/300x300",
          altText: "Product 1",
          isMain: true,
        },
      ],
    },
    {
      id: "2",
      title: "Retinol Treatment",
      price: 52,
      images: [
        {
          url: "https://placehold.co/300x300",
          altText: "Product 2",
          isMain: true,
        },
      ],
    },
    {
      id: "3",
      title: "Hyaluronic Moisturizer",
      price: 38,
      images: [
        {
          url: "https://placehold.co/300x300",
          altText: "Product 3",
          isMain: true,
        },
      ],
    },
    {
      id: "4",
      title: "Niacinamide Serum",
      price: 28,
      images: [
        {
          url: "https://placehold.co/300x300",
          altText: "Product 4",
          isMain: true,
        },
      ],
    },
  ];

  return (
    <section
      className={`py-16 bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl font-bold text-gray-900 mb-4 ${
              isRTL ? "font-arabic" : ""
            }`}
          >
            {t("featuredProducts.title")}
          </h2>
          <p
            className={`text-lg text-gray-600 max-w-2xl mx-auto ${
              isRTL ? "font-arabic" : ""
            }`}
          >
            {t("featuredProducts.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {staticProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={product.images[0].url}
                  alt={product.images[0].altText}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  JOD {product.price}
                </p>
                <button className="mt-3 w-full bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
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
