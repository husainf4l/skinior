"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
import { type Product } from "@/types/product";

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

interface ProductFiltersProps {
  products: Product[];
  locale: string;
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onQueryChange: (query: string) => void;
  isDealsPage?: boolean;
}

export default function ProductFilters({
  products,
  locale,
  filters,
  onFiltersChange,
  onQueryChange,
}: ProductFiltersProps) {
  const t = useTranslations();
  const isRTL = locale === "ar";
  
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activePriceInput, setActivePriceInput] = useState<"min" | "max" | null>(null);

  // Derive filter options from products
  const filterOptions = useMemo(() => {
    const categories = new Map<string, { name: string; nameAr?: string; count: number }>();
    const brands = new Map<string, { name: string; nameAr?: string; count: number }>();
    const skinTypes = new Map<string, number>();
    const concerns = new Map<string, number>();
    
    let minPrice = Number.MAX_SAFE_INTEGER;
    let maxPrice = 0;

    products.forEach((product) => {
      // Categories
      if (product.category) {
        const catId = product.category.id;
        const existing = categories.get(catId) || { 
          name: product.category.name, 
          nameAr: product.category.nameAr,
          count: 0 
        };
        categories.set(catId, { ...existing, count: existing.count + 1 });
      }

      // Brands
      if (product.brand) {
        const brandId = product.brand.id;
        const existing = brands.get(brandId) || { 
          name: product.brand.name, 
          nameAr: product.brand.nameAr,
          count: 0 
        };
        brands.set(brandId, { ...existing, count: existing.count + 1 });
      }

      // Skin types
      if (product.skinType) {
        const types = product.skinType.split(',').map(s => s.trim());
        types.forEach(type => {
          skinTypes.set(type, (skinTypes.get(type) || 0) + 1);
        });
      }

      // Concerns
      if (product.concerns && Array.isArray(product.concerns)) {
        product.concerns.forEach(concern => {
          concerns.set(concern, (concerns.get(concern) || 0) + 1);
        });
      }

      // Price range
      minPrice = Math.min(minPrice, product.price);
      maxPrice = Math.max(maxPrice, product.price);
    });

    return {
      categories: [
        { id: "all", name: t("shop.allCategories") || "All Categories", count: products.length },
        ...Array.from(categories.entries()).map(([id, data]) => ({
          id,
          name: isRTL ? data.nameAr || data.name : data.name,
          count: data.count
        }))
      ],
      brands: [
        { id: "all", name: t("shop.allBrands") || "All Brands", count: products.length },
        ...Array.from(brands.entries()).map(([id, data]) => ({
          id,
          name: isRTL ? data.nameAr || data.name : data.name,
          count: data.count
        }))
      ],
      skinTypes: Array.from(skinTypes.entries()).map(([type, count]) => ({
        id: type,
        name: type,
        count
      })),
      concerns: Array.from(concerns.entries()).map(([concern, count]) => ({
        id: concern,
        name: concern,
        count
      })),
      priceRange: { min: minPrice === Number.MAX_SAFE_INTEGER ? 0 : minPrice, max: maxPrice }
    };
  }, [products, t, isRTL]);

  const handlePriceChange = useCallback((type: "min" | "max", value: string) => {
    const numValue = parseFloat(value) || 0;
    const newRange: [number, number] = [...filters.priceRange];
    if (type === "min") {
      newRange[0] = Math.min(numValue, filters.priceRange[1]);
    } else {
      newRange[1] = Math.max(numValue, filters.priceRange[0]);
    }
    onFiltersChange({ priceRange: newRange });
  }, [filters.priceRange, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      category: "all",
      brand: "all",
      priceRange: [filterOptions.priceRange.min, filterOptions.priceRange.max],
      skinTypes: [],
      concerns: [],
      inStock: false,
      onSale: false,
      isNew: false,
    });
    onQueryChange("");
  }, [filterOptions.priceRange, onFiltersChange, onQueryChange]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.query.trim() !== "" ||
      filters.category !== "all" ||
      filters.brand !== "all" ||
      filters.priceRange[0] !== filterOptions.priceRange.min ||
      filters.priceRange[1] !== filterOptions.priceRange.max ||
      filters.skinTypes.length > 0 ||
      filters.concerns.length > 0 ||
      filters.inStock ||
      filters.onSale ||
      filters.isNew
    );
  }, [filters, filterOptions.priceRange]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("shop.searchPlaceholder") || "Search products, ingredients, or SKU..."}
          className={`w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-lg placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm ${
            isRTL ? "text-right font-cairo" : "text-left"
          }`}
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onFiltersChange({ inStock: !filters.inStock })}
          className={`filter-item px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            filters.inStock
              ? "bg-blue-500 text-white border-blue-500 shadow-md hover:bg-blue-600 hover:shadow-lg"
              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
          } ${isRTL ? "font-cairo" : ""}`}
        >
          {t("shop.inStock") || "In Stock"}
        </button>
        
        <button
          onClick={() => onFiltersChange({ onSale: !filters.onSale })}
          className={`filter-item px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            filters.onSale
              ? "bg-red-500 text-white border-red-500 shadow-md hover:bg-red-600 hover:shadow-lg"
              : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-600 hover:shadow-sm"
          } ${isRTL ? "font-cairo" : ""}`}
        >
          {t("shop.onSale") || "On Sale"}
        </button>
        
        <button
          onClick={() => onFiltersChange({ isNew: !filters.isNew })}
          className={`filter-item px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            filters.isNew
              ? "bg-green-500 text-white border-green-500 shadow-md hover:bg-green-600 hover:shadow-lg"
              : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:text-green-600 hover:shadow-sm"
          } ${isRTL ? "font-cairo" : ""}`}
        >
          {t("shop.new") || "New"}
        </button>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => onFiltersChange({ sort: e.target.value as FilterState["sort"] })}
              className={`appearance-none bg-white border border-gray-200 rounded-xl px-6 py-3 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              <option value="relevance">{t("shop.sortRelevance") || "Relevance"}</option>
              <option value="price_asc">{t("shop.sortPriceLow") || "Price: Low to High"}</option>
              <option value="price_desc">{t("shop.sortPriceHigh") || "Price: High to Low"}</option>
              <option value="newest">{t("shop.sortNewest") || "Newest"}</option>
              <option value="rating">{t("shop.sortRating") || "Highest Rated"}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className={`text-sm text-gray-600 hover:text-gray-900 transition-colors ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {t("shop.clearFilters") || "Clear All"}
            </button>
          )}
          
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm ${
              isRTL ? "font-cairo" : ""
            }`}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${filtersExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {t("shop.filters") || "Filters"}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {filtersExpanded && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-8 filter-expand">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className={`text-base font-semibold text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                {t("shop.category") || "Category"}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filterOptions.categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={filters.category === category.id}
                      onChange={(e) => onFiltersChange({ category: e.target.value })}
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className={`text-sm text-gray-700 group-hover:text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                      {category.name} ({category.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-3">
              <h3 className={`text-base font-semibold text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                {t("shop.brand") || "Brand"}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filterOptions.brands.map((brand) => (
                  <label key={brand.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="brand"
                      value={brand.id}
                      checked={filters.brand === brand.id}
                      onChange={(e) => onFiltersChange({ brand: e.target.value })}
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className={`text-sm text-gray-700 group-hover:text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                      {brand.name} ({brand.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className={`text-base font-semibold text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                {t("shop.priceRange") || "Price Range"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange("min", e.target.value)}
                      onFocus={() => setActivePriceInput("min")}
                      onBlur={() => setActivePriceInput(null)}
                      className={`w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                        activePriceInput === "min" ? "ring-2 ring-blue-500/20 border-blue-500" : ""
                      }`}
                      placeholder="Min"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange("max", e.target.value)}
                      onFocus={() => setActivePriceInput("max")}
                      onBlur={() => setActivePriceInput(null)}
                      className={`w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                        activePriceInput === "max" ? "ring-2 ring-blue-500/20 border-blue-500" : ""
                      }`}
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {t("shop.priceRangeHint", { 
                    min: filterOptions.priceRange.min, 
                    max: filterOptions.priceRange.max 
                  }) || `Range: $${filterOptions.priceRange.min} - $${filterOptions.priceRange.max}`}
                </div>
              </div>
            </div>

            {/* Skin Types */}
            {filterOptions.skinTypes.length > 0 && (
              <div className="space-y-3">
                <h3 className={`text-base font-semibold text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                  {t("shop.skinType") || "Skin Type"}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filterOptions.skinTypes.map((skinType) => (
                    <label key={skinType.id} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.skinTypes.includes(skinType.id)}
                        onChange={(e) => {
                          const newSkinTypes = e.target.checked
                            ? [...filters.skinTypes, skinType.id]
                            : filters.skinTypes.filter(t => t !== skinType.id);
                          onFiltersChange({ skinTypes: newSkinTypes });
                        }}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <span className={`text-sm text-gray-700 group-hover:text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                        {skinType.name} ({skinType.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Concerns */}
            {filterOptions.concerns.length > 0 && (
              <div className="space-y-3">
                <h3 className={`text-base font-semibold text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                  {t("shop.concerns") || "Skin Concerns"}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filterOptions.concerns.map((concern) => (
                    <label key={concern.id} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.concerns.includes(concern.id)}
                        onChange={(e) => {
                          const newConcerns = e.target.checked
                            ? [...filters.concerns, concern.id]
                            : filters.concerns.filter(c => c !== concern.id);
                          onFiltersChange({ concerns: newConcerns });
                        }}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <span className={`text-sm text-gray-700 group-hover:text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                        {concern.name} ({concern.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}