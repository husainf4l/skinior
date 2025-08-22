'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BlogPost } from '../../types/blog';
import BlogSkeleton from './BlogSkeleton';

interface InfiniteScrollProps {
  items: BlogPost[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  renderItem: (item: BlogPost, index: number) => React.ReactNode;
  className?: string;
  threshold?: number;
  locale?: string;
  skeleton?: {
    variant?: 'card' | 'list';
    count?: number;
  };
}

export default function InfiniteScroll({
  items,
  hasMore,
  loading,
  onLoadMore,
  renderItem,
  className = '',
  threshold = 200,
  locale = 'en',
  skeleton = { variant: 'card', count: 3 }
}: InfiniteScrollProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
      threshold: 0.1
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, threshold]);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, loading, onLoadMore]);

  // Smooth scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Items container */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            ref={index === items.length - 1 ? lastItemRef : undefined}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(index % 6) * 0.1}s` }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-8">
          <BlogSkeleton variant={skeleton.variant} count={skeleton.count} />
        </div>
      )}

      {/* Load more trigger element */}
      <div ref={loadMoreRef} className="h-4 mt-8" />

      {/* End message */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-12 border-t border-gray-200 mt-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale === 'ar' ? 'وصلت للنهاية!' : 'You\'ve reached the end!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {locale === 'ar' 
                ? `لقد قرأت جميع المقالات الـ ${items.length}. تحقق لاحقاً للمزيد من المحتوى.`
                : `You've read all ${items.length} articles. Check back later for more content.`
              }
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {locale === 'ar' ? 'العودة للأعلى' : 'Back to top'}
            </button>
          </div>
        </div>
      )}

      {/* Floating scroll to top button */}
      {items.length > 5 && (
        <ScrollToTopButton locale={locale} />
      )}
    </div>
  );
}

// Scroll to top button component
function ScrollToTopButton({ locale }: { locale: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 z-40 flex items-center justify-center"
      title={locale === 'ar' ? 'العودة للأعلى' : 'Back to top'}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}

// Alternative pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  locale?: string;
  loading?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  locale = 'en',
  loading = false,
  className = ''
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {locale === 'ar' ? 'السابق' : 'Previous'}
      </button>

      {/* Page numbers */}
      <div className="flex space-x-1">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={loading || page === '...'}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {locale === 'ar' ? 'التالي' : 'Next'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

// Hook for infinite scroll logic
export function useInfiniteScroll<T>(
  fetchMore: () => Promise<{ items: T[]; hasMore: boolean }>,
  deps: React.DependencyList = []
) {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchMore();
      
      setItems(prev => [...prev, ...result.items]);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more items');
    } finally {
      setLoading(false);
    }
  }, [fetchMore, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setHasMore(true);
    setLoading(false);
    setError(null);
  }, []);

  // Reset when dependencies change
  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    items,
    hasMore,
    loading,
    error,
    loadMore,
    reset,
    setItems
  };
}

// Load more button component (alternative to infinite scroll)
interface LoadMoreButtonProps {
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
  locale?: string;
  className?: string;
}

export function LoadMoreButton({
  onLoadMore,
  loading,
  hasMore,
  locale = 'en',
  className = ''
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className={`text-center py-8 ${className}`}>
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {locale === 'ar' ? 'تحميل المزيد' : 'Load More'}
          </>
        )}
      </button>
    </div>
  );
}
