'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogCategory, BlogTag, BlogAuthor } from '../../types/blog';
import OptimizedImage from '../OptimizedImage';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  categories: BlogCategory[];
  tags: BlogTag[];
  authors?: BlogAuthor[];
  locale: string;
  initialFilters?: SearchFilters;
  isLoading?: boolean;
}

export interface SearchFilters {
  query: string;
  categories: string[];
  tags: string[];
  authors: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
  sortBy: 'publishedAt' | 'views' | 'likes' | 'title' | 'relevance';
  sortOrder: 'asc' | 'desc';
  readTimeRange: {
    min?: number;
    max?: number;
  };
}

const defaultFilters: SearchFilters = {
  query: '',
  categories: [],
  tags: [],
  authors: [],
  dateRange: {},
  sortBy: 'publishedAt',
  sortOrder: 'desc',
  readTimeRange: {}
};

export default function AdvancedSearch({ 
  onSearch, 
  categories, 
  tags, 
  authors = [], 
  locale,
  initialFilters = defaultFilters,
  isLoading = false
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const getText = (textObj: { en: string; ar: string }) => {
    return textObj[locale as keyof typeof textObj] || textObj.en;
  };

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [filters, onSearch]);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    updateFilters({ categories: newCategories });
  };

  const toggleTag = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId];
    updateFilters({ tags: newTags });
  };

  const toggleAuthor = (authorId: string) => {
    const newAuthors = filters.authors.includes(authorId)
      ? filters.authors.filter(id => id !== authorId)
      : [...filters.authors, authorId];
    updateFilters({ authors: newAuthors });
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.query ||
      filters.categories.length > 0 ||
      filters.tags.length > 0 ||
      filters.authors.length > 0 ||
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.readTimeRange.min ||
      filters.readTimeRange.max ||
      filters.sortBy !== 'publishedAt' ||
      filters.sortOrder !== 'desc'
    );
  };

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.tags.length +
      filters.authors.length +
      (filters.dateRange.start ? 1 : 0) +
      (filters.dateRange.end ? 1 : 0) +
      (filters.readTimeRange.min ? 1 : 0) +
      (filters.readTimeRange.max ? 1 : 0)
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Main Search Bar */}
      <div className="p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={searchRef}
            type="text"
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            placeholder={locale === 'ar' ? 'ابحث في المقالات...' : 'Search articles...'}
            className="w-full pl-12 pr-32 py-4 text-lg rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-300"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2">
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={locale === 'ar' ? 'مسح المرشحات' : 'Clear filters'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isExpanded 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              {locale === 'ar' ? 'مرشحات' : 'Filters'}
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            {locale === 'ar' ? 'جاري البحث...' : 'Searching...'}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {locale === 'ar' ? 'ترتيب حسب' : 'Sort by'}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'publishedAt', label: locale === 'ar' ? 'تاريخ النشر' : 'Date Published' },
                { value: 'relevance', label: locale === 'ar' ? 'الصلة' : 'Relevance' },
                { value: 'views', label: locale === 'ar' ? 'المشاهدات' : 'Views' },
                { value: 'likes', label: locale === 'ar' ? 'الإعجابات' : 'Likes' },
                { value: 'title', label: locale === 'ar' ? 'العنوان' : 'Title' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ sortBy: option.value as 'publishedAt' | 'views' | 'likes' | 'title' | 'relevance' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.sortBy === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
              <button
                onClick={() => updateFilters({ 
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                })}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                title={locale === 'ar' ? 'عكس الترتيب' : 'Reverse order'}
              >
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    filters.sortOrder === 'desc' ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {locale === 'ar' ? 'الفئات' : 'Categories'}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.categories.includes(category.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {getText(category.name)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {locale === 'ar' ? 'العلامات' : 'Tags'}
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      filters.tags.includes(tag.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {getText(tag.name)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Authors */}
          {authors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {locale === 'ar' ? 'الكتاب' : 'Authors'}
              </label>
              <div className="flex flex-wrap gap-2">
                {authors.map((author) => (
                  <button
                    key={author.id}
                    onClick={() => toggleAuthor(author.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.authors.includes(author.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                    }`}
                  >
                                    <OptimizedImage
                  src={author.avatar}
                  alt={getText(author.name)}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
                    {getText(author.name)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {locale === 'ar' ? 'نطاق التاريخ' : 'Date Range'}
            </label>
            <div className="flex flex-wrap gap-3">
              <input
                type="date"
                value={filters.dateRange.start || ''}
                onChange={(e) => updateFilters({ 
                  dateRange: { ...filters.dateRange, start: e.target.value } 
                })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={locale === 'ar' ? 'من تاريخ' : 'From date'}
              />
              <span className="flex items-center text-gray-500">
                {locale === 'ar' ? 'إلى' : 'to'}
              </span>
              <input
                type="date"
                value={filters.dateRange.end || ''}
                onChange={(e) => updateFilters({ 
                  dateRange: { ...filters.dateRange, end: e.target.value } 
                })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={locale === 'ar' ? 'إلى تاريخ' : 'To date'}
              />
            </div>
          </div>

          {/* Reading Time Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {locale === 'ar' ? 'وقت القراءة (دقائق)' : 'Reading Time (minutes)'}
            </label>
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="number"
                value={filters.readTimeRange.min || ''}
                onChange={(e) => updateFilters({ 
                  readTimeRange: { ...filters.readTimeRange, min: parseInt(e.target.value) || undefined } 
                })}
                placeholder={locale === 'ar' ? 'أقل' : 'Min'}
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={filters.readTimeRange.max || ''}
                onChange={(e) => updateFilters({ 
                  readTimeRange: { ...filters.readTimeRange, max: parseInt(e.target.value) || undefined } 
                })}
                placeholder={locale === 'ar' ? 'أكثر' : 'Max'}
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
              <span className="text-sm text-gray-500">
                {locale === 'ar' ? 'دقائق' : 'minutes'}
              </span>
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {locale === 'ar' ? 'مرشحات سريعة' : 'Quick Filters'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilters({ 
                  dateRange: { 
                    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
                  } 
                })}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-300 transition-colors"
              >
                {locale === 'ar' ? 'آخر أسبوع' : 'Last week'}
              </button>
              <button
                onClick={() => updateFilters({ 
                  dateRange: { 
                    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
                  } 
                })}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-300 transition-colors"
              >
                {locale === 'ar' ? 'آخر شهر' : 'Last month'}
              </button>
              <button
                onClick={() => updateFilters({ readTimeRange: { min: 1, max: 5 } })}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-300 transition-colors"
              >
                {locale === 'ar' ? 'قراءة سريعة' : 'Quick read'}
              </button>
              <button
                onClick={() => updateFilters({ sortBy: 'views', sortOrder: 'desc' })}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-300 transition-colors"
              >
                {locale === 'ar' ? 'الأكثر شعبية' : 'Most popular'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
