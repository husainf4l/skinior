'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogComment } from '../../types/blog';
import OptimizedImage from '../OptimizedImage';

interface EnhancedCommentsProps {
  postId: string;
  comments: BlogComment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  locale?: string;
  currentUserId?: string;
  loading?: boolean;
  maxDepth?: number;
}

export default function EnhancedComments({
  comments,
  onAddComment,
  onLikeComment,
  locale = 'en',
  currentUserId,
  loading = false,
  maxDepth = 3
}: EnhancedCommentsProps) {
  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes'>('newest');
  
  const newCommentRef = useRef<HTMLTextAreaElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  useEffect(() => {
    if (replyingTo && replyRef.current) {
      replyRef.current.focus();
    }
  }, [replyingTo]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onAddComment(newCommentText.trim());
      setNewCommentText('');
      if (newCommentRef.current) {
        newCommentRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || submitting || !replyingTo) return;

    try {
      setSubmitting(true);
      await onAddComment(replyText.trim(), replyingTo);
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to add reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpanded = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Build comment tree structure
  const buildCommentTree = (): BlogComment[] => {
    const commentMap = new Map<string, BlogComment & { children: BlogComment[] }>();
    const rootComments: (BlogComment & { children: BlogComment[] })[] = [];

    // Initialize all comments with children array
    safeComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    // Build tree structure
    safeComments.forEach(comment => {
      const commentWithChildren = commentMap.get(comment.id)!;
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.children.push(commentWithChildren);
        } else {
          rootComments.push(commentWithChildren);
        }
      } else {
        rootComments.push(commentWithChildren);
      }
    });

    return rootComments;
  };

  // Sort comments
  const sortComments = () => {
    return safeComments.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return locale === 'ar' ? 'الآن' : 'now';
    if (diffMins < 60) return locale === 'ar' ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return locale === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    if (diffDays < 7) return locale === 'ar' ? `منذ ${diffDays} أيام` : `${diffDays}d ago`;
    
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const CommentItem = ({ 
    comment, 
    depth = 0 
  }: { 
    comment: BlogComment & { children?: BlogComment[] }; 
    depth?: number 
  }) => {
    const hasReplies = comment.children && comment.children.length > 0;
    const isExpanded = expandedComments.has(comment.id);
    const canReply = depth < maxDepth;

    return (
      <div className={`${depth > 0 ? 'ml-8 border-l border-gray-200 pl-4' : ''}`}>
        <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {comment.author.avatar ? (
                <OptimizedImage
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {comment.author.name}
                </h4>
                <time className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </time>
                {comment.author.email === currentUserId && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {locale === 'ar' ? 'أنت' : 'You'}
                  </span>
                )}
              </div>

              {/* Content */}
              <p 
                className="text-gray-700 leading-relaxed text-sm mb-4"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              >
                {comment.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLikeComment(comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                </button>

                {canReply && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {locale === 'ar' ? 'رد' : 'Reply'}
                  </button>
                )}

                {hasReplies && (
                  <button
                    onClick={() => toggleExpanded(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {locale === 'ar' 
                      ? `${comment.children?.length} ${comment.children?.length === 1 ? 'رد' : 'ردود'}`
                      : `${comment.children?.length} ${comment.children?.length === 1 ? 'reply' : 'replies'}`
                    }
                  </button>
                )}
              </div>

              {/* Reply form */}
              {replyingTo === comment.id && (
                <form onSubmit={handleSubmitReply} className="mt-4">
                  <textarea
                    ref={replyRef}
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      autoResize(e.target);
                    }}
                    placeholder={locale === 'ar' ? 'اكتب ردك...' : 'Write your reply...'}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    rows={2}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={!replyText.trim() || submitting}
                      className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting 
                        ? (locale === 'ar' ? 'جاري النشر...' : 'Posting...') 
                        : (locale === 'ar' ? 'رد' : 'Reply')
                      }
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Nested replies */}
        {hasReplies && isExpanded && (
          <div className="mt-4 space-y-4">
            {comment.children?.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const sortedComments = sortComments(buildCommentTree());

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          {locale === 'ar' 
            ? `التعليقات (${comments.length})` 
            : `Comments (${comments.length})`
          }
        </h3>

        {/* Sort options */}
        {comments.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {locale === 'ar' ? 'ترتيب:' : 'Sort by:'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'likes')}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">{locale === 'ar' ? 'الأحدث' : 'Newest'}</option>
              <option value="oldest">{locale === 'ar' ? 'الأقدم' : 'Oldest'}</option>
              <option value="likes">{locale === 'ar' ? 'الأكثر إعجاباً' : 'Most liked'}</option>
            </select>
          </div>
        )}
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmitComment} className="bg-white border border-gray-200 rounded-xl p-6">
        <textarea
          ref={newCommentRef}
          value={newCommentText}
          onChange={(e) => {
            setNewCommentText(e.target.value);
            autoResize(e.target);
          }}
          placeholder={locale === 'ar' ? 'اكتب تعليقك...' : 'Write your comment...'}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-gray-500">
            {locale === 'ar' 
              ? 'كن محترماً ومهذباً في تعليقاتك' 
              : 'Please be respectful and constructive in your comments'
            }
          </div>
          <button
            type="submit"
            disabled={!newCommentText.trim() || submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {submitting 
              ? (locale === 'ar' ? 'جاري النشر...' : 'Posting...') 
              : (locale === 'ar' ? 'نشر التعليق' : 'Post Comment')
            }
          </button>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            {locale === 'ar' ? 'لا توجد تعليقات بعد' : 'No comments yet'}
          </h4>
          <p className="text-gray-600">
            {locale === 'ar' 
              ? 'كن أول من يعلق على هذا المقال ويبدأ النقاش!' 
              : 'Be the first to comment on this article and start the discussion!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}
