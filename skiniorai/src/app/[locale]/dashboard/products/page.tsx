"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface BaseProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  benefits: string[];
  image: string;
}

interface FavoriteProduct extends BaseProduct {
  inRoutine: boolean;
  lastUsed: string;
}

interface RecommendedProduct extends BaseProduct {
  matchReason: string;
  confidence: number;
}

type Product = FavoriteProduct | RecommendedProduct;

interface BaseProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  benefits: string[];
  image: string;
}

interface FavoriteProduct extends BaseProduct {
  inRoutine: boolean;
  lastUsed: string;
}

interface RecommendedProduct extends BaseProduct {
  matchReason: string;
  confidence: number;
}

const ProductsPage = () => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [selectedTab, setSelectedTab] = useState("favorites");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const favoriteProducts: FavoriteProduct[] = [
    {
      id: "prod-001",
      name: "Gentle Foaming Cleanser",
      brand: "SkinioR Essentials",
      price: 29.99,
      rating: 4.8,
      reviews: 1247,
      category: "cleansers",
      benefits: ["Gentle", "Hydrating", "All Skin Types"],
      inRoutine: true,
      lastUsed: "2024-01-20",
      image: "/placeholder-product.jpg",
    },
    {
      id: "prod-002",
      name: "Vitamin C Brightening Serum",
      brand: "SkinioR Advanced",
      price: 59.99,
      rating: 4.9,
      reviews: 892,
      category: "serums",
      benefits: ["Brightening", "Anti-aging", "Antioxidant"],
      inRoutine: true,
      lastUsed: "2024-01-19",
      image: "/placeholder-product.jpg",
    },
    {
      id: "prod-003",
      name: "Retinol Night Treatment",
      brand: "SkinioR Professional",
      price: 79.99,
      rating: 4.7,
      reviews: 634,
      category: "treatments",
      benefits: ["Anti-aging", "Texture", "Professional Grade"],
      inRoutine: false,
      lastUsed: "2024-01-15",
      image: "/placeholder-product.jpg",
    },
    {
      id: "prod-004",
      name: "Hydrating Moisturizer SPF 30",
      brand: "SkinioR Daily",
      price: 45.99,
      rating: 4.6,
      reviews: 1456,
      category: "moisturizers",
      benefits: ["SPF Protection", "Hydrating", "Daily Use"],
      inRoutine: true,
      lastUsed: "2024-01-20",
      image: "/placeholder-product.jpg",
    },
    {
      id: "prod-005",
      name: "Niacinamide Pore Refining Serum",
      brand: "SkinioR Essentials",
      price: 34.99,
      rating: 4.5,
      reviews: 789,
      category: "serums",
      benefits: ["Pore Minimizing", "Oil Control", "Texture"],
      inRoutine: false,
      lastUsed: "2024-01-12",
      image: "/placeholder-product.jpg",
    },
  ];

  const recommendedProducts: RecommendedProduct[] = [
    {
      id: "rec-001",
      name: "Hyaluronic Acid Serum",
      brand: "SkinioR Essentials",
      price: 39.99,
      rating: 4.8,
      reviews: 956,
      category: "serums",
      benefits: ["Intense Hydration", "Plumping", "All Skin Types"],
      matchReason: "Perfect for your combination skin hydration needs",
      confidence: 95,
      image: "/placeholder-product.jpg",
    },
    {
      id: "rec-002",
      name: "Salicylic Acid Spot Treatment",
      brand: "SkinioR Professional",
      price: 24.99,
      rating: 4.7,
      reviews: 567,
      category: "treatments",
      benefits: ["Acne Treatment", "Spot Reduction", "Fast Acting"],
      matchReason: "Targets your main concern: acne and blackheads",
      confidence: 92,
      image: "/placeholder-product.jpg",
    },
    {
      id: "rec-003",
      name: "Clay Purifying Mask",
      brand: "SkinioR Weekly",
      price: 27.99,
      rating: 4.6,
      reviews: 423,
      category: "masks",
      benefits: ["Deep Cleansing", "Pore Refining", "Weekly Treatment"],
      matchReason: "Helps with large pores and oiliness control",
      confidence: 88,
      image: "/placeholder-product.jpg",
    },
  ];

  const categories = [
    { key: "all", label: isRTL ? "الكل" : "All" },
    { key: "cleansers", label: isRTL ? "منظفات" : "Cleansers" },
    { key: "serums", label: isRTL ? "سيرم" : "Serums" },
    { key: "moisturizers", label: isRTL ? "مرطبات" : "Moisturizers" },
    { key: "treatments", label: isRTL ? "علاجات" : "Treatments" },
    { key: "masks", label: isRTL ? "أقنعة" : "Masks" },
  ];

  const tabs = [
    {
      key: "favorites",
      label: isRTL ? "المفضلة" : "Favorites",
      count: favoriteProducts.length,
    },
    {
      key: "recommended",
      label: isRTL ? "موصى بها" : "Recommended",
      count: recommendedProducts.length,
    },
    {
      key: "routine",
      label: isRTL ? "الروتين" : "My Routine",
      count: favoriteProducts.filter((p) => p.inRoutine).length,
    },
  ];

  const getFilteredProducts = (): (FavoriteProduct | RecommendedProduct)[] => {
    let products: (FavoriteProduct | RecommendedProduct)[] =
      selectedTab === "favorites"
        ? favoriteProducts
        : selectedTab === "recommended"
        ? recommendedProducts
        : favoriteProducts.filter((p) => p.inRoutine);

    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    return products;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <DashboardLayout>
      <div className={`p-8 ${isRTL ? "font-cairo text-right" : ""}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl font-semibold text-gray-900 mb-3 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "منتجاتي" : "My Products"}
              </h1>
              <p
                className={`text-lg text-gray-600 ${isRTL ? "font-cairo" : ""}`}
              >
                {isRTL
                  ? "إدارة منتجاتك المفضلة والموصى بها"
                  : "Manage your favorite and recommended products"}
              </p>
            </div>
            <Link
              href={`/${locale}/shop`}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {isRTL ? "تصفح المتجر" : "Browse Shop"}
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-blue-600 mb-2">
                  {favoriteProducts.length}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "منتجات مفضلة" : "Favorite Products"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-green-600 mb-2">
                  {favoriteProducts.filter((p) => p.inRoutine).length}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "في الروتين اليومي" : "In Daily Routine"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-600 mb-2">
                  {recommendedProducts.length}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "توصيات جديدة" : "New Recommendations"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-orange-600 mb-2">
                  $
                  {favoriteProducts
                    .reduce((sum, p) => sum + p.price, 0)
                    .toFixed(0)}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "قيمة المجموعة" : "Collection Value"}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      selectedTab === tab.key
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    } ${isRTL ? "font-cairo space-x-reverse" : ""}`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedTab === tab.key
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.key
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } ${isRTL ? "font-cairo" : ""}`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredProducts().map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold text-gray-900 mb-1 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {product.name}
                      </h3>
                      <p
                        className={`text-sm text-gray-600 mb-2 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {product.brand}
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </p>
                    </div>
                    <button className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.benefits.slice(0, 3).map((benefit, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>

                  {/* Recommendation Reason (for recommended tab) */}
                  {selectedTab === "recommended" &&
                    "matchReason" in product && (
                      <div className="mb-4 p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center space-x-2 mb-1">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span
                            className={`text-xs font-medium text-green-700 ${
                              isRTL ? "font-cairo" : ""
                            }`}
                          >
                            {(product as RecommendedProduct).confidence}%{" "}
                            {isRTL ? "توافق" : "Match"}
                          </span>
                        </div>
                        <p
                          className={`text-xs text-green-700 ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {(product as RecommendedProduct).matchReason}
                        </p>
                      </div>
                    )}

                  {/* Last Used (for favorites/routine) */}
                  {selectedTab !== "recommended" && "lastUsed" in product && (
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs text-gray-500 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL ? "آخر استخدام: " : "Last used: "}
                        {formatDate((product as FavoriteProduct).lastUsed)}
                      </span>
                      {"inRoutine" in product &&
                        (product as FavoriteProduct).inRoutine && (
                          <span
                            className={`px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full ${
                              isRTL ? "font-cairo" : ""
                            }`}
                          >
                            {isRTL ? "في الروتين" : "In Routine"}
                          </span>
                        )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {selectedTab === "recommended" ? (
                      <>
                        <button
                          className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {isRTL ? "إضافة للمفضلة" : "Add to Favorites"}
                        </button>
                        <button
                          className={`px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {isRTL ? "التفاصيل" : "Details"}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium transition-colors ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {isRTL ? "إعادة الطلب" : "Reorder"}
                        </button>
                        <button
                          className={`px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {isRTL ? "المراجعة" : "Review"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {getFilteredProducts().length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3
                className={`text-lg font-medium text-gray-900 mb-2 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "لا توجد منتجات" : "No Products Found"}
              </h3>
              <p className={`text-gray-500 mb-6 ${isRTL ? "font-cairo" : ""}`}>
                {isRTL
                  ? "لم نجد أي منتجات تطابق الفلتر المحدد"
                  : "No products match the selected filters"}
              </p>
              <Link
                href={`/${locale}/shop`}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "تصفح المنتجات" : "Browse Products"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
