"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { productsService, type Product } from "@/services/productsService";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

export default function ShopProductList({ locale }: { locale: string }) {
  const t = useTranslations();
  const isRTL = locale === "ar";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters / UI state
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all"
  );
  const [sort, setSort] = useState<
    "relevance" | "price_asc" | "price_desc" | "newest"
  >("relevance");
  const [page, setPage] = useState(1);

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

  // Derive categories from products
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      const name = p.category?.name || p.category?.slug || "uncategorized";
      const id = p.category?.id || name;
      if (!map.has(String(id))) map.set(String(id), String(name));
    });
    return [
      { id: "all", name: t("shop.allCategories") ?? "All" },
      ...Array.from(map.entries()).map(([id, name]) => ({ id, name })),
    ];
  }, [products, t]);

  // Debounced query setter for better UX
  const setQueryDebounced = useCallback((val: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setQuery(val);
      setPage(1);
    }, 300);
  }, []);

  // Filtering + sorting
  const filtered = useMemo(() => {
    let list = products.slice();

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => {
        return (
          p.title?.toLowerCase().includes(q) ||
          p.titleAr?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.activeIngredients?.toLowerCase().includes(q) ||
          p.descriptionEn?.toLowerCase().includes(q) ||
          p.descriptionAr?.toLowerCase().includes(q)
        );
      });
    }

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter(
        (p) =>
          String(p.categoryId) === String(selectedCategory) ||
          String(p.category?.id) === String(selectedCategory)
      );
    }

    switch (sort) {
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
      case "relevance":
      default:
        // keep original order (server relevance)
        break;
    }

    return list;
  }, [products, query, selectedCategory, sort]);

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
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="w-2/3">
            <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="w-1/3 flex gap-3 justify-end">
            <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-4 animate-pulse h-64"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  }

  return (
    <section
      className={`${isRTL ? "rtl font-cairo" : "ltr"}`}
      aria-labelledby="shop-heading"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            {t("shop.search") || "Search"}
          </label>
          <input
            id="search"
            type="search"
            placeholder={
              t("shop.searchPlaceholder") ||
              "Search products, ingredients or SKU..."
            }
            onChange={(e) => setQueryDebounced(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black/10 focus:border-black/20"
            aria-label={t("shop.search") || "Search"}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <label htmlFor="category" className="sr-only">
            {t("shop.category") || "Category"}
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as string | "all");
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 bg-white"
            aria-label={t("shop.category") || "Category"}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label htmlFor="sort" className="sr-only">
            {t("shop.sort") || "Sort"}
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as "relevance" | "price_asc" | "price_desc" | "newest");
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 bg-white"
            aria-label={t("shop.sort") || "Sort"}
          >
            <option value="relevance">
              {t("shop.sortRelevance") || "Relevance"}
            </option>
            <option value="price_asc">
              {t("shop.sortPriceLow") || "Price: Low to High"}
            </option>
            <option value="price_desc">
              {t("shop.sortPriceHigh") || "Price: High to Low"}
            </option>
            <option value="newest">{t("shop.sortNewest") || "Newest"}</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="mb-4 text-sm text-gray-600">
        {t("shop.resultsCount", { count: filtered.length }) ??
          `${filtered.length} products found`}
      </div>

      {/* Grid */}
      {visibleProducts.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          {t("shop.noResults") || "No products match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex justify-center items-center gap-3"
        >
          <button
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-md border border-gray-200 bg-white disabled:opacity-50"
            aria-label={t("shop.prev") || "Previous"}
          >
            ‹
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const idx = i + 1;
              return (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  aria-current={page === idx ? "page" : undefined}
                  className={`px-3 py-2 rounded-md border ${
                    page === idx ? "bg-black text-white" : "bg-white"
                  } border-gray-200`}
                >
                  {idx}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-md border border-gray-200 bg-white disabled:opacity-50"
            aria-label={t("shop.next") || "Next"}
          >
            ›
          </button>
        </nav>
      )}
    </section>
  );
}
