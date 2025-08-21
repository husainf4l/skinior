'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogService } from "../../../../services/blogService";
import { BlogPost, BlogComment } from "../../../../types/blog";
import OptimizedImage from "../../../../components/OptimizedImage";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [locale, setLocale] = useState<string>('en');
  const [postId, setPostId] = useState<string>('');
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Get params
  useEffect(() => {
    params.then(({ locale: paramLocale, id }) => {
      setLocale(paramLocale);
      setPostId(id);
    });
  }, [params]);

  // Fetch post data
  useEffect(() => {
    if (!postId) return;

    const fetchPostData = async () => {
      try {
        setLoading(true);
        
        // Fetch post
        const postData = await BlogService.getPostById(postId);
        setPost(postData);
        setLikesCount(postData.likes || 0);

        // Increment views
        BlogService.incrementViews(postId);

        // Fetch related posts
        const related = await BlogService.getRelatedPosts(postId, 3);
        setRelatedPosts(related);

        // Fetch comments
        const postComments = await BlogService.getComments(postId);
        setComments(postComments);

        setError(null);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        if (err.message === 'BLOG_POST_NOT_FOUND') {
          notFound();
        }
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  // Handle like
  const handleLike = async () => {
    try {
      const result = await BlogService.likePost(postId);
      setIsLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        console.log('Please login to like posts');
      }
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      const newComment = await BlogService.addComment(postId, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (err: any) {
      console.error('Failed to add comment:', err);
      if (err.message === 'UNAUTHORIZED') {
        console.log('Please login to comment');
      }
    } finally {
      setCommentLoading(false);
    }
  };

  // Share functions
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post ? getText(post.title) : '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'ar' ? 'المقال غير موجود' : 'Post not found'}
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link 
            href={`/${locale}/blog`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {locale === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <Link href={`/${locale}`} className="hover:text-gray-900 transition-colors">
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/${locale}/blog`} className="hover:text-gray-900 transition-colors">
              {locale === 'ar' ? 'المدونة' : 'Blog'}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium truncate">
              {getText(post.title)}
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                {getText(post.category.name)}
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <time className="text-sm text-gray-500">
                {formatDate(post.publishedAt)}
              </time>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-sm text-gray-500">
                {getText(post.readTime)}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {getText(post.title)}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto mb-8">
              {getText(post.excerpt)}
            </p>
            
            {/* Author & Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex items-center gap-4">
                <OptimizedImage
                  src={post.author.avatar}
                  alt={getText(post.author.name)}
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {getText(post.author.name)}
                  </h3>
                  <p className="text-gray-600 font-light">
                    {getText(post.author.bio)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.views || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{likesCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{comments.length}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <OptimizedImage
              src={post.featuredImage}
              alt={getText(post.title)}
              width={1200}
              height={600}
              className="w-full h-96 lg:h-[500px] object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Article Content */}
        <div 
          className="prose prose-xl max-w-none prose-gray prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-p:font-light prose-p:mb-6 prose-li:text-lg prose-li:font-light prose-strong:font-semibold prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ 
            __html: getText(post.content)
          }}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />

        {/* Tags */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {locale === 'ar' ? 'المواضيع' : 'Topics'}
          </h4>
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
              >
                {getText(tag.name)}
              </span>
            ))}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-12 pt-12 border-t border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">
            {locale === 'ar' ? 'شارك المقال' : 'Share this article'}
          </h4>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                isLiked 
                  ? 'bg-red-100 text-red-600 border border-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'
              }`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likesCount}
            </button>
            <button 
              onClick={shareOnFacebook}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              {locale === 'ar' ? 'فيسبوك' : 'Facebook'}
            </button>
            <button 
              onClick={shareOnTwitter}
              className="bg-sky-500 text-white px-6 py-3 rounded-full hover:bg-sky-600 transition-colors font-medium"
            >
              {locale === 'ar' ? 'تويتر' : 'Twitter'}
            </button>
            <button 
              onClick={shareOnLinkedIn}
              className="bg-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition-colors font-medium"
            >
              {locale === 'ar' ? 'لينكد إن' : 'LinkedIn'}
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          {locale === 'ar' ? `التعليقات (${comments.length})` : `Comments (${comments.length})`}
        </h3>
        
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-12">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={locale === 'ar' ? 'اكتب تعليقك...' : 'Write your comment...'}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentLoading 
                ? (locale === 'ar' ? 'جاري النشر...' : 'Posting...') 
                : (locale === 'ar' ? 'نشر التعليق' : 'Post Comment')
              }
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                {comment.author.avatar && (
                  <OptimizedImage
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                    <time className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>
                  <p className="text-gray-700 leading-relaxed" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {comment.likes}
                    </button>
                    <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      {locale === 'ar' ? 'رد' : 'Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {comments.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              {locale === 'ar' ? 'لا توجد تعليقات بعد' : 'No comments yet'}
            </h4>
            <p className="text-gray-600">
              {locale === 'ar' ? 'كن أول من يعلق على هذا المقال' : 'Be the first to comment on this article'}
            </p>
          </div>
        )}
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {locale === 'ar' ? 'مقالات ذات صلة' : 'Related Articles'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/${locale}/blog/${relatedPost.id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <OptimizedImage
                    src={relatedPost.featuredImage}
                    alt={getText(relatedPost.title)}
                    width={400}
                    height={240}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                      {getText(relatedPost.category.name)}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <time className="text-xs text-gray-500">
                      {formatDate(relatedPost.publishedAt)}
                    </time>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {getText(relatedPost.title)}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {getText(relatedPost.excerpt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group bg-gray-50 px-6 py-3 rounded-xl hover:bg-gray-100"
          >
            <svg className={`w-5 h-5 ${locale === 'ar' ? 'ml-2 rotate-180' : 'mr-2'} transition-transform group-hover:-translate-x-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    </div>
  );
}
