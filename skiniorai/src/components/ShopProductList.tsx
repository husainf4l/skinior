"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { productsService } from "@/services/productsService";
import { type Product, type ProductQueryParams, type ProductsResult } from "@/types/product";
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
  const urlCategory = searchParams.get("category") || "all";

  const [productsResult, setProductsResult] = useState<ProductsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    category: urlCategory as string | "all",
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

  // Load products with API filters
  const loadProducts = useCallback(async (apiFilters: ProductQueryParams) => {
    try {
      const result = await productsService.getProducts(apiFilters);
      return result;
    } catch (err) {
      console.error('Error loading filtered products:', err);
      throw err;
    }
  }, []);

  // Convert filter state to API filters
  const convertToApiFilters = useCallback((filterState: FilterState, currentPage: number, dealsOnly: boolean): ProductQueryParams => {
    const apiFilters: ProductQueryParams = {
      page: currentPage,
      limit: PAGE_SIZE,
      isActive: true
    };

    if (dealsOnly) {
      apiFilters.onSale = true;
    }

    if (filterState.query.trim()) {
      apiFilters.search = filterState.query.trim();
    }

    if (filterState.category && filterState.category !== 'all') {
      apiFilters.category = filterState.category;
    }

    if (filterState.brand && filterState.brand !== 'all') {
      apiFilters.brand = filterState.brand;
    }

    if (filterState.priceRange[0] > 0) {
      apiFilters.minPrice = filterState.priceRange[0];
    }

    if (filterState.priceRange[1] < 1000) {
      apiFilters.maxPrice = filterState.priceRange[1];
    }

    if (filterState.skinTypes.length > 0) {
      apiFilters.skinType = filterState.skinTypes.join(',');
    }

    if (filterState.concerns.length > 0) {
      apiFilters.concernsFilter = filterState.concerns;
    }

    if (filterState.onSale) {
      apiFilters.onSale = true;
    }

    if (filterState.isNew) {
      apiFilters.isNew = true;
    }

    // Map sort values to API format
    switch (filterState.sort) {
      case 'price_asc':
        apiFilters.sortBy = 'price';
        apiFilters.sortOrder = 'asc';
        break;
      case 'price_desc':
        apiFilters.sortBy = 'price';
        apiFilters.sortOrder = 'desc';
        break;
      case 'newest':
        apiFilters.sortBy = 'createdAt';
        apiFilters.sortOrder = 'desc';
        break;
      case 'rating':
        apiFilters.sortBy = 'rating';
        apiFilters.sortOrder = 'desc';
        break;
      case 'relevance':
      default:
        // Use default server sorting
        break;
    }

    return apiFilters;
  }, []);

  // Initial load - just load the first page of products
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Load initial filtered products based on page type
    const initialFilters: ProductQueryParams = { 
      page: 1, 
      limit: PAGE_SIZE, 
      isActive: true,
      category: urlCategory !== 'all' ? urlCategory : undefined
    };
    
    if (isDealsPage) {
      initialFilters.onSale = true;
    }

    loadProducts(initialFilters)
      .then((result) => {
        if (!mounted) return;
        setProductsResult(result);
        
        // For now, we'll use the current products for filters
        // In a production setup, you might want a separate endpoint for filter metadata
        setAllProducts(result.products || []);
        
        // Initialize price range - you could get this from API metadata instead
        if (result.products && result.products.length > 0) {
          const prices = result.products.map(p => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setFilters(prev => ({
            ...prev,
            priceRange: [Math.max(0, minPrice - 10), maxPrice + 10] // Add some padding
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
  }, [t, loadProducts, isDealsPage, urlCategory]);

  // If the `category` query param changes, sync it into the filters state and reload
  useEffect(() => {
    const cat = urlCategory as string;

    // Avoid updating if category already matches to prevent loops
    if (filters.category === cat) return;

    // Update local filter state
    const updatedFilters = { ...filters, category: cat };
    setFilters(updatedFilters);
    setPage(1);

    // Reload products for the new category
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const apiFilters = convertToApiFilters(updatedFilters, 1, isDealsPage);
        const result = await loadProducts(apiFilters);
        setProductsResult(result);
        setAllProducts(result.products || []);
      } catch (err) {
        console.error('Error applying category from URL:', err);
        setError('Failed to apply category');
      } finally {
        setLoading(false);
      }
    })();
  }, [urlCategory, isDealsPage, convertToApiFilters, loadProducts, filters]);

  // Filter change handlers
  const handleFiltersChange = useCallback(async (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPage(1);
    
    setLoading(true);
    try {
      const apiFilters = convertToApiFilters(updatedFilters, 1, isDealsPage);
      const result = await loadProducts(apiFilters);
      setProductsResult(result);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  }, [filters, isDealsPage, loadProducts, convertToApiFilters]);

  const handleQueryChange = useCallback((query: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      const updatedFilters = { ...filters, query };
      setFilters(updatedFilters);
      setPage(1);
      
      setLoading(true);
      try {
        const apiFilters = convertToApiFilters(updatedFilters, 1, isDealsPage);
        const result = await loadProducts(apiFilters);
        setProductsResult(result);
      } catch (err) {
        console.error('Error applying search:', err);
        setError('Failed to apply search');
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [filters, isDealsPage, loadProducts, convertToApiFilters]);

  // Handle page changes
  useEffect(() => {
    if (!productsResult || page === productsResult.pagination.page) return;
    
    setLoading(true);
    const apiFilters = convertToApiFilters(filters, page, isDealsPage);
    
    loadProducts(apiFilters)
      .then(result => {
        setProductsResult(result);
      })
      .catch(err => {
        console.error('Error loading page:', err);
        setError('Failed to load page');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, filters, isDealsPage, productsResult, convertToApiFilters, loadProducts]);

  const products = Array.isArray(productsResult?.products) ? productsResult.products : [];
  const pagination = productsResult?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalCount = pagination?.total || 0;

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
        products={Array.isArray(allProducts) ? allProducts : []}
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
                ? `${totalCount} منتج مخفض`
                : `${totalCount} deals found`
              : t("shop.resultsCount", { count: totalCount }) ??
                `${totalCount} products found`}
          </p>
        </div>
        {totalCount > 0 && totalPages > 1 && (
          <div className="text-sm text-gray-500">
            {isRTL ? "صفحة" : "Page"} {pagination?.page || page} {isRTL ? "من" : "of"} {totalPages}
          </div>
        )}
      </div>

      {/* Enhanced grid */}
      {products.length === 0 ? (
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
          {products.map((p, index) => (
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
            disabled={page === 1 || loading}
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
                  disabled={loading}
                  aria-current={page === idx ? "page" : undefined}
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border transition-all duration-200 hover:shadow-md text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
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
            disabled={page === totalPages || loading}
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