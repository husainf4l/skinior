"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { productsService } from "@/services/productsService";
import { type Product } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductFilters from "./shop/ProductFilters";

const PAGE_SIZE = 12;

interface FilterState {
  query: string;
  category: string | "all";
  brand: string | "all";
  priceRange: [number, number];
  skinTypes: string[];
  concerns: string[];
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
  sort: "relevance" | "price_asc" | "price_desc" | "newest" | "rating";
}

export default function ShopProductList({ locale }: { locale: string }) {
  const t = useTranslations();
  const isRTL = locale === "ar";
  const searchParams = useSearchParams();
  const isDealsPage = searchParams.get("deals") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    category: "all",
    brand: "all",
    priceRange: [0, 1000],
    skinTypes: [],
    concerns: [],
    inStock: false,
    onSale: false,
    isNew: false,
    sort: "relevance",
  });

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    productsService
      .getProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(data || []);
        
        // Initialize price range based on actual product data
        if (data && data.length > 0) {
          const prices = data.map(p => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setFilters(prev => ({
            ...prev,
            priceRange: [minPrice, maxPrice]
          }));
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted)
          setError(t("shop.loadingError") || "Failed to load products");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [t]);

  // Filter change handlers
  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const handleQueryChange = useCallback((query: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setFilters(prev => ({ ...prev, query }));
      setPage(1);
    }, 300);
  }, []);

  // Advanced filtering + sorting
  const filtered = useMemo(() => {
    let list = products.slice();

    // Filter for deals if on deals page
    if (isDealsPage) {
      list = list.filter(
        (p) => p.compareAtPrice && p.compareAtPrice > p.price && p.isActive
      );
    }

    // Text search
    if (filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      list = list.filter((p) => {
        return (
          p.title?.toLowerCase().includes(q) ||
          p.titleAr?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.activeIngredients?.toLowerCase().includes(q) ||
          p.descriptionEn?.toLowerCase().includes(q) ||
          p.descriptionAr?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      list = list.filter(
        (p) =>
          String(p.categoryId) === String(filters.category) ||
          String(p.category?.id) === String(filters.category)
      );
    }

    // Brand filter
    if (filters.brand && filters.brand !== "all") {
      list = list.filter(
        (p) =>
          String(p.brandId) === String(filters.brand) ||
          String(p.brand?.id) === String(filters.brand)
      );
    }

    // Price range filter
    list = list.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Skin type filter
    if (filters.skinTypes.length > 0) {
      list = list.filter((p) => {
        if (!p.skinType) return false;
        const productSkinTypes = p.skinType.split(',').map(s => s.trim().toLowerCase());
        return filters.skinTypes.some(filterType => 
          productSkinTypes.includes(filterType.toLowerCase())
        );
      });
    }

    // Concerns filter
    if (filters.concerns.length > 0) {
      list = list.filter((p) => {
        if (!p.concerns || !Array.isArray(p.concerns)) return false;
        const productConcerns = p.concerns.map(c => c.toLowerCase());
        return filters.concerns.some(filterConcern => 
          productConcerns.includes(filterConcern.toLowerCase())
        );
      });
    }

    // Stock filter
    if (filters.inStock) {
      list = list.filter((p) => p.isInStock && p.stockQuantity > 0);
    }

    // Sale filter
    if (filters.onSale) {
      list = list.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    // New products filter
    if (filters.isNew) {
      list = list.filter((p) => p.isNew);
    }

    // Sorting
    switch (filters.sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "rating":
        list.sort((a, b) => (b.reviewStats?.averageRating || 0) - (a.reviewStats?.averageRating || 0));
        break;
      case "relevance":
      default:
        // keep original order (server relevance)
        break;
    }

    return list;
  }, [products, filters, isDealsPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Clamp page
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Enhanced loading header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-2/3">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Enhanced loading grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <section
      className={`${isRTL ? "rtl font-cairo" : "ltr"} space-y-8`}
      aria-labelledby="shop-heading"
    >
      {/* Apple-style filters */}
      <ProductFilters
        products={products}
        locale={locale}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onQueryChange={handleQueryChange}
        isDealsPage={isDealsPage}
      />

      {/* Enhanced deals indicator */}
      {isDealsPage && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3
                className={`text-lg font-semibold text-red-900 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "عروض حصرية" : "Exclusive Deals"}
              </h3>
              <p className={`text-red-700 ${isRTL ? "font-cairo" : ""}`}>
                {isRTL
                  ? "عرض المنتجات المخفضة فقط"
                  : "Showing discounted products only"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced results info */}
      <div
        className={`mb-8 flex items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <p className={`text-lg text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
            {isDealsPage
              ? isRTL
                ? `${filtered.length} منتج مخفض`
                : `${filtered.length} deals found`
              : t("shop.resultsCount", { count: filtered.length }) ??
                `${filtered.length} products found`}
          </p>
          {filtered.length !== products.length && !isDealsPage && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {isRTL ? `من ${products.length} منتج` : `of ${products.length} total`}
            </span>
          )}
        </div>
        {filtered.length > 0 && totalPages > 1 && (
          <div className="text-sm text-gray-500">
            {isRTL ? "صفحة" : "Page"} {page} {isRTL ? "من" : "of"} {totalPages}
          </div>
        )}
      </div>

      {/* Enhanced grid */}
      {visibleProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h3
            className={`text-xl font-medium text-gray-900 mb-2 ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {isRTL ? "لا توجد نتائج" : "No results found"}
          </h3>
          <p
            className={`text-gray-600 text-center max-w-md ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            {t("shop.noResults") || "No products match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {visibleProducts.map((p, index) => (
            <div
              key={p.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {/* Enhanced pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-16 flex justify-center items-center gap-2"
        >
          <button
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            disabled={page === 1}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
            aria-label={t("shop.prev") || "Previous"}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2 mx-4">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let idx;
              if (totalPages <= 5) {
                idx = i + 1;
              } else if (page <= 3) {
                idx = i + 1;
              } else if (page >= totalPages - 2) {
                idx = totalPages - 4 + i;
              } else {
                idx = page - 2 + i;
              }

              return (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  aria-current={page === idx ? "page" : undefined}
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border transition-all duration-200 hover:shadow-md text-sm sm:text-base ${
                    page === idx
                      ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {idx}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
            disabled={page === totalPages}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
            aria-label={t("shop.next") || "Next"}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </nav>
      )}
    </section>
  );
}
