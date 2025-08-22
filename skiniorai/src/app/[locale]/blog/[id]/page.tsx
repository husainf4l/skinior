"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogService } from "../../../../services/blogService";
import { BlogPost, BlogComment } from "../../../../types/blog";
import OptimizedImage from "../../../../components/OptimizedImage";
import { BlogSEO } from "../../../../components/blog/BlogSEO";
import {
  BlogErrorWrapper,
  BlogPostErrorFallback,
} from "../../../../components/blog/BlogErrorBoundary";
import BlogSkeleton from "../../../../components/blog/BlogSkeleton";
import ReadingProgress, {
  ReadingStats,
} from "../../../../components/blog/ReadingProgress";

import EnhancedComments from "../../../../components/blog/EnhancedComments";
import {
  sanitizeHTML,
  validateBlogContent,
} from "../../../../utils/contentSanitizer";
import { commentRateLimiter } from "../../../../utils/contentSanitizer";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [locale, setLocale] = useState<string>("en");
  const [postId, setPostId] = useState<string>("");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);

  // Get params
  useEffect(() => {
    params.then(({ locale: paramLocale, id }) => {
      setLocale(paramLocale);
      setPostId(id);
    });
  }, [params]);

  // Get text by locale
  const getText = useCallback(
    (textObj: { en: string; ar: string }) => {
      return textObj[locale as keyof typeof textObj] || textObj.en;
    },
    [locale]
  );

  // Fetch post data
  useEffect(() => {
    if (!postId) return;

    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post
        const postData = await BlogService.getPostById(postId);

        // Validate content security
        const validation = validateBlogContent(
          getText(postData.content),
          locale
        );
        if (!validation.isValid) {
          console.warn("Content validation issues:", validation.errors);
        }

        setPost(postData);
        setLikesCount(postData.likes || 0);

        // Increment views
        BlogService.incrementViews(postId);

        // Fetch related posts and comments in parallel
        const [related, postComments] = await Promise.all([
          BlogService.getRelatedPosts(postId, 3).catch(() => []),
          BlogService.getComments(postId).catch(() => []),
        ]);

        setRelatedPosts(related);
        setComments(postComments);
      } catch (err) {
        console.error("Error fetching post:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load blog post";
        if (errorMessage === "BLOG_POST_NOT_FOUND") {
          notFound();
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, locale, getText]);

  // Handle like
  const handleLike = async () => {
    if (!post) return;

    try {
      const result = await BlogService.likePost(postId);
      setIsLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to like post";
      if (errorMessage === "UNAUTHORIZED") {
        // Show login prompt or redirect
        console.log("Please login to like posts");
      }
    }
  };

  // Handle comment submission with rate limiting
  const handleAddComment = async (
    content: string,
    parentId?: string
  ): Promise<void> => {
    if (!commentRateLimiter.isAllowed("comment-submission")) {
      throw new Error(
        locale === "ar"
          ? "كثرة التعليقات. انتظر قليلاً."
          : "Too many comments. Please wait a moment."
      );
    }

    try {
      setCommentLoading(true);
      const newComment = await BlogService.addComment(
        postId,
        content,
        parentId
      );
      setComments((prev) => [newComment, ...prev]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add comment";
      if (errorMessage === "UNAUTHORIZED") {
        throw new Error(
          locale === "ar"
            ? "يجب تسجيل الدخول للتعليق"
            : "Please login to comment"
        );
      }
      throw err;
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle comment like
  const handleLikeComment = async (commentId: string): Promise<void> => {
    try {
      // This would be implemented in the BlogService
      console.log("Liking comment:", commentId);
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  // Share functions with better error handling
  const shareOnFacebook = () => {
    try {
      const url = encodeURIComponent(window.location.href);
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("Failed to share on Facebook:", err);
    }
  };

  const shareOnTwitter = () => {
    try {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(post ? getText(post.title) : "");
      window.open(
        `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("Failed to share on Twitter:", err);
    }
  };

  const shareOnLinkedIn = () => {
    try {
      const url = encodeURIComponent(window.location.href);
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("Failed to share on LinkedIn:", err);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
      console.log("URL copied to clipboard");
    } catch (err) {
      console.error("Failed to copy URL:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <>
        <BlogSEO locale={locale} isPostPage />
        <BlogSkeleton variant="post" />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <BlogSEO locale={locale} isPostPage />
        <BlogPostErrorFallback onRetry={() => window.location.reload()} />
      </>
    );
  }

  const sanitizedContent = sanitizeHTML(getText(post.content));

  return (
    <BlogErrorWrapper>
      <BlogSEO post={post} locale={locale} isPostPage />

      {/* Reading Progress */}
      <ReadingProgress target="article" showPercentage />
      <ReadingStats target="article" locale={locale} />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <nav
          className="bg-gray-50 border-b border-gray-200"
          aria-label="Breadcrumb"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ol
              className="flex items-center space-x-2 text-sm text-gray-500"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {locale === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {locale === "ar" ? "المدونة" : "Blog"}
                </Link>
              </li>
              <li>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </li>
              <li>
                <span
                  className="text-gray-900 font-medium truncate"
                  aria-current="page"
                >
                  {getText(post.title)}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {getText(post.category.name)}
                </span>
                <span
                  className="w-1 h-1 bg-gray-400 rounded-full"
                  aria-hidden="true"
                ></span>
                <time
                  className="text-sm text-gray-500"
                  dateTime={post.publishedAt}
                >
                  {formatDate(post.publishedAt)}
                </time>
                <span
                  className="w-1 h-1 bg-gray-400 rounded-full"
                  aria-hidden="true"
                ></span>
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
              <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
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
                  <div
                    className="flex items-center gap-2"
                    title={locale === "ar" ? "المشاهدات" : "Views"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>{post.views || 0}</span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    title={locale === "ar" ? "الإعجابات" : "Likes"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{likesCount}</span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    title={locale === "ar" ? "التعليقات" : "Comments"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
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
        </header>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Content */}
          <div
            className="prose prose-xl max-w-none prose-gray prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-p:font-light prose-p:mb-6 prose-li:text-lg prose-li:font-light prose-strong:font-semibold prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{
              __html: sanitizedContent,
            }}
            dir={locale === "ar" ? "rtl" : "ltr"}
          />

          {/* Tags */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {locale === "ar" ? "المواضيع" : "Topics"}
            </h4>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  tabIndex={0}
                  role="button"
                  aria-label={`${
                    locale === "ar" ? "موضوع" : "Topic"
                  }: ${getText(tag.name)}`}
                >
                  {getText(tag.name)}
                </span>
              ))}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mt-12 pt-12 border-t border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              {locale === "ar" ? "شارك المقال" : "Share this article"}
            </h4>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isLiked
                    ? "bg-red-100 text-red-600 border border-red-200 focus:ring-red-500"
                    : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600 focus:ring-gray-500"
                }`}
                aria-label={`${
                  isLiked
                    ? locale === "ar"
                      ? "إلغاء الإعجاب"
                      : "Unlike"
                    : locale === "ar"
                    ? "أعجبني"
                    : "Like"
                } - ${likesCount} ${locale === "ar" ? "إعجاب" : "likes"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {likesCount}
              </button>
              <button
                onClick={shareOnFacebook}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`${
                  locale === "ar" ? "مشاركة على فيسبوك" : "Share on Facebook"
                }: ${getText(post.title)}`}
              >
                {locale === "ar" ? "فيسبوك" : "Facebook"}
              </button>
              <button
                onClick={shareOnTwitter}
                className="bg-sky-500 text-white px-6 py-3 rounded-full hover:bg-sky-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                aria-label={`${
                  locale === "ar" ? "مشاركة على تويتر" : "Share on Twitter"
                }: ${getText(post.title)}`}
              >
                {locale === "ar" ? "تويتر" : "Twitter"}
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="bg-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                aria-label={`${
                  locale === "ar" ? "مشاركة على لينكد إن" : "Share on LinkedIn"
                }: ${getText(post.title)}`}
              >
                {locale === "ar" ? "لينكد إن" : "LinkedIn"}
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label={locale === "ar" ? "نسخ الرابط" : "Copy link"}
              >
                {locale === "ar" ? "نسخ الرابط" : "Copy Link"}
              </button>
            </div>
          </div>
        </article>

        {/* Enhanced Comments Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
          <EnhancedComments
            postId={postId}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            locale={locale}
            loading={commentLoading}
          />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100"
            aria-label={locale === "ar" ? "مقالات ذات صلة" : "Related articles"}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              {locale === "ar" ? "مقالات ذات صلة" : "Related Articles"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/${locale}/blog/${relatedPost.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`${
                    locale === "ar" ? "اقرأ المقال" : "Read article"
                  }: ${getText(relatedPost.title)}`}
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
                      <span
                        className="w-1 h-1 bg-gray-400 rounded-full"
                        aria-hidden="true"
                      ></span>
                      <time
                        className="text-xs text-gray-500"
                        dateTime={relatedPost.publishedAt}
                      >
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
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group bg-gray-50 px-6 py-3 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <svg
                className={`w-5 h-5 ${
                  locale === "ar" ? "ml-2 rotate-180" : "mr-2"
                } transition-transform group-hover:-translate-x-1`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {locale === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
            </Link>
          </div>
        </div>
      </div>
    </BlogErrorWrapper>
  );
}
