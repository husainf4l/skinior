"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { memo, useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  image: string;
}

// Minimalist categories data with absolute paths for testing
const categories: Category[] = [
  {
    id: 1,
    name: "Cleansers",
    nameAr: "منظفات",
    slug: "cleansers",
    description: "Gentle and effective face cleansers",
    image: "/hero/hero1.webp",
  },
  {
    id: 2,
    name: "Moisturizers",
    nameAr: "مرطبات",
    slug: "moisturizers",
    description: "Hydrating skincare essentials",
    image: "/hero/hero2.webp",
  },
  {
    id: 3,
    name: "Serums",
    nameAr: "أمصال",
    slug: "serums",
    description: "Concentrated treatment solutions",
    image: "/hero/hero1.webp",
  },
  {
    id: 4,
    name: "Sunscreen",
    nameAr: "واقي الشمس",
    slug: "sunscreen",
    description: "Essential sun protection",
    image: "/hero/hero2.webp",
  },
  {
    id: 5,
    name: "Masks",
    nameAr: "أقنعة",
    slug: "masks",
    description: "Intensive skin treatments",
    image: "/hero/hero1.webp",
  },
  {
    id: 6,
    name: "Eye Care",
    nameAr: "العناية بالعيون",
    slug: "eye-care",
    description: "Delicate eye area care",
    image: "/hero/hero2.webp",
  },
];

const ShopByCategory = memo(() => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);

  const isRTL = locale === "ar";

  const handleImageError = (categoryId: number) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
    console.error("Image failed to load for category:", categoryId);
  };

  // Intersection Observer for subtle animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    // Debug: Log that component is mounting
    console.log("ShopByCategory component mounted");
    console.log("Categories data:", categories);
  }, []);

  const handleCategoryClick = (slug: string) => {
    router.push(`/shop?category=${slug}`);
  };

  // Minimal loading skeleton
  if (!mounted) {
    return (
      <section
        className={`py-24 bg-white ${isRTL ? "rtl font-cairo" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="h-10 bg-gray-100 rounded-lg w-72 mx-auto mb-6" />
            <div className="h-6 bg-gray-100 rounded w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] bg-gray-100 rounded-3xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`py-24 bg-white ${isRTL ? "rtl font-cairo" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2
            className={`text-5xl sm:text-6xl font-light text-gray-900 mb-6 tracking-tight ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("shopByCategory.title", { default: "Shop by Category" })}
          </h2>
          <p
            className={`text-xl text-gray-500 max-w-2xl mx-auto font-light ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("shopByCategory.subtitle", {
              default: "Discover skincare essentials organized by category",
            })}
          </p>
        </div>

        {/* Minimal Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image-focused Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gray-50 group-hover:shadow-2xl transition-all duration-500">
                {/* Hero Image */}
                <div className="aspect-[4/5] relative overflow-hidden">
                  {!imageErrors[category.id] ? (
                    <Image
                      src={category.image}
                      alt={isRTL ? category.nameAr : category.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      loading={index < 2 ? "eager" : "lazy"} // Only load first 2 images eagerly
                      priority={index === 0} // Only prioritize the very first image
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={() => handleImageError(category.id)}
                      onLoad={() =>
                        console.log(
                          "Image loaded successfully:",
                          category.image
                        )
                      }
                    />
                  ) : (
                    // Fallback content when image fails to load
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-blue-600 font-medium">
                          {isRTL ? category.nameAr : category.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Minimal Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                </div>

                {/* Minimal Info Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
                      <h3
                        className={`text-2xl font-medium text-gray-900 mb-2 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? category.nameAr : category.name}
                      </h3>

                      <p
                        className={`text-gray-600 text-sm mb-4 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {category.description}
                      </p>

                      {/* Minimal CTA */}
                      <div className="flex items-center justify-between">
                        <div />
                        <div className="flex items-center text-gray-900 group-hover:translate-x-1 transition-transform duration-300">
                          <span
                            className={`text-sm font-medium ${
                              isRTL ? "font-cairo ml-2" : "mr-2"
                            }`}
                          >
                            {t("common.explore", { default: "Explore" })}
                          </span>
                          <svg
                            className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal CTA */}
        <div
          className={`text-center mt-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <button
            onClick={() => router.push("/shop")}
            className={`inline-flex items-center px-8 py-4 border border-gray-200 text-gray-900 font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 active:scale-95 ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("shopByCategory.viewAll", { default: "View All Products" })}
            <svg
              className={`w-5 h-5 ${isRTL ? "mr-3 rotate-180" : "ml-3"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
});

ShopByCategory.displayName = "ShopByCategory";

export default ShopByCategory;
