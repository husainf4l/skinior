'use client';

import { useState, useEffect } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import Link from "next/link";
import type { Metadata } from "next";
import { BlogService } from "../../../services/blogService";
import { BlogPost, BlogCategory, BlogTag, BlogFilters } from "../../../types/blog";
import OptimizedImage from "../../../components/OptimizedImage";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default function BlogPage({ params }: BlogPageProps) {
  const [locale, setLocale] = useState<string>('en');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [popularTags, setPopularTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [emailSubscription, setEmailSubscription] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [filters, setFilters] = useState<BlogFilters>({
    limit: 10,
    offset: 0,
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  // Get locale from params
  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale);
      setRequestLocale(paramLocale);
    });
  }, [params]);

  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured posts
        const featuredPosts = await BlogService.getFeaturedPosts(1);
        if (featuredPosts.length > 0) {
          setFeaturedPost(featuredPosts[0]);
        }

        // Fetch regular posts (excluding featured)
        const blogListResponse = await BlogService.getPosts({
          ...filters,
          featured: false,
          published: true
        });
        
        setPosts(blogListResponse.posts || []);
        setCategories(blogListResponse.categories || []);
        setPopularTags(blogListResponse.popularTags || []);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [filters]);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const searchResults = await BlogService.searchPosts(searchQuery, locale, 20);
      setPosts(searchResults);
      setFeaturedPost(null); // Hide featured post during search
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search posts');
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter
  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilters(prev => ({
      ...prev,
      category: categoryId || undefined,
      offset: 0
    }));
  };

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
    } catch (err: any) {
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

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'ar' ? 'حدث خطأ' : 'Something went wrong'}
          </h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {locale === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
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
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'ar' ? 'ابحث في المقالات...' : 'Search articles...'}
                  className="w-full pl-12 pr-24 py-4 text-lg rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-lg"
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  {locale === 'ar' ? 'بحث' : 'Search'}
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === '' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {locale === 'ar' ? 'الكل' : 'All'}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {getText(category.name)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Article */}
        {featuredPost && !searchQuery && (
          <section className="mb-20">
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
                    <time className="text-sm text-gray-500">
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
                    className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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

        {/* Articles Grid */}
        <section>
          {searchQuery && (
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              {locale === 'ar' 
                ? `نتائج البحث عن "${searchQuery}"` 
                : `Search results for "${searchQuery}"`
              }
            </h2>
          )}
          
          {!searchQuery && (
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16 text-center tracking-tight">
              {locale === 'ar' ? 'أحدث المقالات' : 'Latest Articles'}
            </h2>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-8">
                <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ar' ? 'لا توجد مقالات' : 'No articles found'}
              </h3>
              <p className="text-gray-600 mb-8">
                {locale === 'ar' 
                  ? 'لم نجد أي مقالات تطابق بحثك. جرب كلمات أخرى.' 
                  : 'We couldn\'t find any articles matching your search. Try different keywords.'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    window.location.reload();
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  {locale === 'ar' ? 'مسح البحث' : 'Clear Search'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200"
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
                        <time className="text-sm text-gray-500">
                          {formatDate(post.publishedAt)}
                        </time>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="text-sm text-gray-500">
                          {getText(post.readTime)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
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
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Subscription */}
        <section className="mt-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 lg:p-16 text-center border border-blue-100">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <input
                type="email"
                value={emailSubscription}
                onChange={(e) => setEmailSubscription(e.target.value)}
                placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                required
                disabled={subscriptionStatus === 'loading'}
              />
              <button 
                type="submit"
                disabled={subscriptionStatus === 'loading'}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {subscriptionStatus === 'loading' 
                  ? (locale === 'ar' ? 'جاري الاشتراك...' : 'Subscribing...') 
                  : (locale === 'ar' ? 'اشترك' : 'Subscribe')
                }
              </button>
            </form>
            
            {subscriptionStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-xl">
                <p className="text-green-800 font-medium">
                  {locale === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!'}
                </p>
              </div>
            )}
            
            {subscriptionStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-xl">
                <p className="text-red-800 font-medium">
                  {locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Please try again.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <section className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              {locale === 'ar' ? 'المواضيع الشائعة' : 'Popular Topics'}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularTags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200"
                >
                  {getText(tag.name)}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}