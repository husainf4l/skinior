'use client';

import { useState, useEffect, useCallback } from "react";

import Link from "next/link";
import { BlogService } from "../../../services/blogService";
import { BlogPost, BlogCategory, BlogTag, BlogFilters } from "../../../types/blog";
import OptimizedImage from "../../../components/OptimizedImage";
import { BlogSEO } from "../../../components/blog/BlogSEO";
import BlogSkeleton, { BlogHeroSkeleton } from "../../../components/blog/BlogSkeleton";
import { BlogErrorWrapper, BlogListErrorFallback } from "../../../components/blog/BlogErrorBoundary";
import AdvancedSearch, { SearchFilters } from "../../../components/blog/AdvancedSearch";
import InfiniteScroll from "../../../components/blog/InfiniteScroll";
import { searchRateLimiter } from "../../../utils/contentSanitizer";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default function BlogPage({ params }: BlogPageProps) {
  const [locale, setLocale] = useState<string>('en');
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [popularTags, setPopularTags] = useState<BlogTag[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSubscription, setEmailSubscription] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    tags: [],
    authors: [],
    dateRange: {},
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    readTimeRange: {}
  });
  const [isSearching, setIsSearching] = useState(false);

  // Get locale from params
  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale);
    });
  }, [params]);

  // State for posts
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Load more posts function with ref to avoid dependency issues
  const loadMorePosts = useCallback(async (isInitialLoad: boolean = false): Promise<void> => {
    if (postsLoading || (!hasMore && !isInitialLoad)) {
      return;
    }

    try {
      setPostsLoading(true);
      setPostsError(null);

      // Rate limit search requests
      if (currentFilters.query && !searchRateLimiter.isAllowed('blog-search')) {
        throw new Error('Too many search requests. Please wait a moment.');
      }

      // Use functional state update to get current posts length
      let currentOffset = 0;
      if (!isInitialLoad) {
        setPosts(prevPosts => {
          currentOffset = prevPosts.length;
          return prevPosts; // Don't change posts here
        });
      }
    
      const filters: BlogFilters = {
        categories: currentFilters.categories.length > 0 ? currentFilters.categories : undefined,
        tags: currentFilters.tags.length > 0 ? currentFilters.tags : undefined,
        authors: currentFilters.authors.length > 0 ? currentFilters.authors : undefined,
        query: currentFilters.query || undefined,
        limit: 12,
        offset: currentOffset,
        published: true,
        sortBy: currentFilters.sortBy === 'relevance' ? 'publishedAt' : currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder,
        dateRange: currentFilters.dateRange,
        readTimeRange: currentFilters.readTimeRange
      };

      let newPosts: BlogPost[] = [];
      let hasMoreResults = false;

      // If searching, use search endpoint
      if (currentFilters.query) {
        const searchResults = await BlogService.searchPosts(
          currentFilters.query, 
          locale, 
          12
        );
        newPosts = searchResults.slice(currentOffset, currentOffset + 12);
        hasMoreResults = searchResults.length > currentOffset + 12;
      } else {
        // Regular post fetching
        const blogResponse = await BlogService.getPosts(filters);
        newPosts = blogResponse.posts || [];
        hasMoreResults = blogResponse.hasMore || false;
      }

      // Update posts based on whether it's initial load or append
      if (isInitialLoad || currentOffset === 0) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(hasMoreResults);
    } catch (error) {
      setPostsError(error instanceof Error ? error.message : 'Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  }, [currentFilters, locale, postsLoading, hasMore]);

  // Reset posts when filters change
  const resetPosts = useCallback(() => {
    setPosts([]);
    setHasMore(true);
    setPostsError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        // Load featured post and categories, get tags from the main posts response
        const [featuredResponse, categoriesResponse] = await Promise.all([
          BlogService.getFeaturedPosts(1).catch((err) => {
            console.log('Featured posts error:', err);
            return [];
          }),
          BlogService.getCategories().catch((err) => {
            console.log('Categories error:', err);
            return [];
          })
        ]);

        // Get tags from the initial posts response (since your API includes popularTags in the posts response)
        try {
          const initialPostsResponse = await BlogService.getPosts({ limit: 12, offset: 0, published: true });
          setPopularTags(Array.isArray(initialPostsResponse.popularTags) ? initialPostsResponse.popularTags : []);
        } catch (err) {
          console.log('Error loading tags from posts response:', err);
          setPopularTags([]);
        }

        setFeaturedPost(featuredResponse[0] || null);
        setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : []);

        // Initial posts will be loaded by the filter change effect

      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog data');
      } finally {
        setInitialLoading(false);
      }
    };

    if (locale) {
      loadInitialData();
    }
  }, [locale]);

  // Reset posts when filters change
  useEffect(() => {
    // Only run if locale is set and we either haven't loaded initially or filters have changed
    if (!locale) return;
    
    resetPosts();
    setIsSearching(!!currentFilters.query);
    
    // Load initial posts after reset with a small delay
    const timeoutId = setTimeout(() => {
      loadMorePosts(true);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [currentFilters, resetPosts, locale, loadMorePosts]);

  // Handle search
  const handleSearch = useCallback((filters: SearchFilters) => {
    setCurrentFilters(filters);
  }, []);

  // Handle newsletter subscription
  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubscription.trim()) return;

    try {
      setSubscriptionStatus('loading');
      await BlogService.subscribeToNewsletter(emailSubscription, locale);
      setSubscriptionStatus('success');
      setEmailSubscription('');
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
    } catch (err) {
      console.error('Subscription error:', err);
      setSubscriptionStatus('error');
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get text by locale
  const getText = (textObj: { en: string; ar: string }) => {
    return textObj[locale as keyof typeof textObj] || textObj.en;
  };

  // Render blog post card
  const renderPostCard = (post: BlogPost) => (
    <article
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200"
      role="article"
      aria-labelledby={`post-title-${post.id}`}
    >
      <Link href={`/${locale}/blog/${post.id}`} className="block">
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={post.featuredImage}
            alt={getText(post.title)}
            width={400}
            height={240}
            className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
              {getText(post.category.name)}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <time className="text-sm text-gray-500" dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-sm text-gray-500">
              {getText(post.readTime)}
            </span>
          </div>
          <h3 
            id={`post-title-${post.id}`}
            className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2"
          >
            {getText(post.title)}
          </h3>
          <p className="text-gray-600 leading-relaxed font-light line-clamp-3 mb-4">
            {getText(post.excerpt)}
          </p>
          <div className="flex items-center gap-3">
            <OptimizedImage
              src={post.author.avatar}
              alt={getText(post.author.name)}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              {getText(post.author.name)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );

  if (initialLoading) {
    return (
      <>
        <BlogSEO locale={locale} />
        <div className="min-h-screen bg-white">
          <BlogHeroSkeleton />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BlogSkeleton variant="featured" />
            <div className="mt-20">
              <div className="h-16 bg-gray-200 rounded w-64 mx-auto mb-16"></div>
              <BlogSkeleton count={6} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BlogSEO locale={locale} />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <BlogListErrorFallback onRetry={() => window.location.reload()} />
        </div>
      </>
    );
  }

  return (
    <BlogErrorWrapper>
      <BlogSEO 
        locale={locale} 
        posts={posts}
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-none">
                {locale === 'ar' ? 'مدونة سكينيور' : 'Skinior Blog'}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light mb-12">
                {locale === 'ar' 
                  ? 'اكتشف أحدث نصائح العناية بالبشرة والمقالات المتخصصة من خبراء سكينيور'
                  : 'Discover expert insights and evidence-based guidance for healthier, more radiant skin'
                }
              </p>
              
              {/* Advanced Search */}
              <div className="max-w-4xl mx-auto">
                <AdvancedSearch
                  onSearch={handleSearch}
                  categories={categories}
                  tags={popularTags}
                  locale={locale}
                  initialFilters={currentFilters}
                  isLoading={postsLoading}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Featured Article */}
          {featuredPost && !isSearching && (
            <section className="mb-20" role="banner" aria-label="Featured article">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className="lg:flex lg:items-center">
                  <div className="lg:w-3/5">
                    <div className="relative h-96 lg:h-[600px] overflow-hidden">
                      <OptimizedImage
                        src={featuredPost.featuredImage}
                        alt={getText(featuredPost.title)}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {locale === 'ar' ? 'مميز' : 'Featured'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-2/5 p-8 lg:p-12 lg:pl-16">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                        {getText(featuredPost.category.name)}
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <time className="text-sm text-gray-500" dateTime={featuredPost.publishedAt}>
                        {formatDate(featuredPost.publishedAt)}
                      </time>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                      {getText(featuredPost.title)}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8 font-light">
                      {getText(featuredPost.excerpt)}
                    </p>
                    <div className="flex items-center gap-4 mb-8">
                      <OptimizedImage
                        src={featuredPost.author.avatar}
                        alt={getText(featuredPost.author.name)}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getText(featuredPost.author.name)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getText(featuredPost.readTime)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/${locale}/blog/${featuredPost.id}`}
                      className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`${locale === 'ar' ? 'اقرأ المقال' : 'Read article'}: ${getText(featuredPost.title)}`}
                    >
                      {locale === 'ar' ? 'اقرأ المقال' : 'Read Article'}
                      <svg className={`w-5 h-5 ${locale === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Articles Grid with Infinite Scroll */}
          <section role="main" aria-label={locale === 'ar' ? 'قائمة المقالات' : 'Articles list'}>
            {isSearching && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                {locale === 'ar' 
                  ? `نتائج البحث عن "${currentFilters.query}"` 
                  : `Search results for "${currentFilters.query}"`
                }
              </h2>
            )}
            
            {!isSearching && (
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16 text-center tracking-tight">
                {locale === 'ar' ? 'أحدث المقالات' : 'Latest Articles'}
              </h2>
            )}

            {postsError ? (
              <BlogListErrorFallback onRetry={() => loadMorePosts(true)} />
            ) : (
              <InfiniteScroll
                items={posts}
                hasMore={hasMore}
                loading={postsLoading}
                onLoadMore={() => loadMorePosts(false)}
                renderItem={renderPostCard}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
                locale={locale}
                skeleton={{ variant: 'card', count: 6 }}
              />
            )}
          </section>

          {/* Newsletter Subscription */}
          <section className="mt-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 lg:p-16 text-center border border-blue-100" aria-label={locale === 'ar' ? 'اشتراك النشرة الإخبارية' : 'Newsletter subscription'}>
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                  {locale === 'ar' ? 'ابق على اطلاع دائم' : 'Stay in the know'}
                </h3>
                <p className="text-lg text-gray-600 font-light">
                  {locale === 'ar' 
                    ? 'احصل على أحدث نصائح العناية بالبشرة والمقالات الحصرية مباشرة في بريدك الإلكتروني'
                    : 'Get the latest skincare insights and exclusive content delivered straight to your inbox'
                  }
                </p>
              </div>
              
              <form onSubmit={handleNewsletterSubscription} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <label htmlFor="newsletter-email" className="sr-only">
                  {locale === 'ar' ? 'عنوان البريد الإلكتروني' : 'Email address'}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={emailSubscription}
                  onChange={(e) => setEmailSubscription(e.target.value)}
                  placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                  className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                  required
                  disabled={subscriptionStatus === 'loading'}
                  aria-describedby="newsletter-description"
                />
                <button 
                  type="submit"
                  disabled={subscriptionStatus === 'loading'}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {subscriptionStatus === 'loading' 
                    ? (locale === 'ar' ? 'جاري الاشتراك...' : 'Subscribing...') 
                    : (locale === 'ar' ? 'اشترك' : 'Subscribe')
                  }
                </button>
              </form>
              
              {subscriptionStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-xl" role="alert">
                  <p className="text-green-800 font-medium">
                    {locale === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!'}
                  </p>
                </div>
              )}
              
              {subscriptionStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-xl" role="alert">
                  <p className="text-red-800 font-medium">
                    {locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Please try again.'}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Popular Tags */}
          {popularTags.length > 0 && (
            <section className="mt-20 text-center" aria-label={locale === 'ar' ? 'المواضيع الشائعة' : 'Popular topics'}>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                {locale === 'ar' ? 'المواضيع الشائعة' : 'Popular Topics'}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {popularTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleSearch({ ...currentFilters, tags: [tag.id] })}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`${locale === 'ar' ? 'تصفية حسب علامة' : 'Filter by tag'}: ${getText(tag.name)}`}
                  >
                    {getText(tag.name)}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </BlogErrorWrapper>
  );
}