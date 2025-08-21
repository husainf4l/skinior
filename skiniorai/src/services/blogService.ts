import { ApiService } from './apiService';
import { 
  BlogPost, 
  BlogListResponse, 
  BlogFilters, 
  BlogCategory, 
  BlogTag, 
  BlogStats,
  BlogComment,
  CreateBlogPostRequest,
  UpdateBlogPostRequest 
} from '../types/blog';

export class BlogService {
  private static readonly BLOG_ENDPOINTS = {
    POSTS: '/blog/posts',
    POST_BY_ID: (id: string) => `/blog/posts/${id}`,
    POST_BY_SLUG: (slug: string) => `/blog/posts/slug/${slug}`,
    CATEGORIES: '/blog/categories',
    TAGS: '/blog/tags',
    STATS: '/blog/stats',
    FEATURED: '/blog/posts/featured',
    COMMENTS: (postId: string) => `/blog/posts/${postId}/comments`,
    LIKE_POST: (postId: string) => `/blog/posts/${postId}/like`,
    SEARCH: '/blog/search',
    RELATED: (postId: string) => `/blog/posts/${postId}/related`
  };

  // Public methods (no auth required)
  static async getPosts(filters: BlogFilters = {}): Promise<BlogListResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `${this.BLOG_ENDPOINTS.POSTS}?${queryParams.toString()}`;
    const response = await ApiService.authenticatedFetch(endpoint, { requireAuth: false });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getPostById(id: string): Promise<BlogPost> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.POST_BY_ID(id), 
      { requireAuth: false }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('BLOG_POST_NOT_FOUND');
      }
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getPostBySlug(slug: string, locale: string = 'en'): Promise<BlogPost> {
    const response = await ApiService.authenticatedFetch(
      `${this.BLOG_ENDPOINTS.POST_BY_SLUG(slug)}?locale=${locale}`, 
      { requireAuth: false }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('BLOG_POST_NOT_FOUND');
      }
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getFeaturedPosts(limit: number = 5): Promise<BlogPost[]> {
    const response = await ApiService.authenticatedFetch(
      `${this.BLOG_ENDPOINTS.FEATURED}?limit=${limit}`, 
      { requireAuth: false }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch featured posts: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getCategories(): Promise<BlogCategory[]> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.CATEGORIES, 
      { requireAuth: false }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getTags(): Promise<BlogTag[]> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.TAGS, 
      { requireAuth: false }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async searchPosts(query: string, locale: string = 'en', limit: number = 10): Promise<BlogPost[]> {
    const queryParams = new URLSearchParams({
      q: query,
      locale,
      limit: limit.toString()
    });

    const response = await ApiService.authenticatedFetch(
      `${this.BLOG_ENDPOINTS.SEARCH}?${queryParams.toString()}`, 
      { requireAuth: false }
    );

    if (!response.ok) {
      throw new Error(`Failed to search posts: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
    const response = await ApiService.authenticatedFetch(
      `${this.BLOG_ENDPOINTS.RELATED(postId)}?limit=${limit}`, 
      { requireAuth: false }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getBlogStats(): Promise<BlogStats> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.STATS, 
      { requireAuth: false }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog stats: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  // Comment methods
  static async getComments(postId: string): Promise<BlogComment[]> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.COMMENTS(postId), 
      { requireAuth: false }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async addComment(postId: string, content: string, parentId?: string): Promise<BlogComment> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.COMMENTS(postId), 
      {
        method: 'POST',
        body: JSON.stringify({ content, parentId }),
        requireAuth: true
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`Failed to add comment: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  // Interaction methods
  static async likePost(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.LIKE_POST(postId), 
      {
        method: 'POST',
        requireAuth: true
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`Failed to like post: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async incrementViews(postId: string): Promise<void> {
    try {
      await ApiService.authenticatedFetch(
        `${this.BLOG_ENDPOINTS.POST_BY_ID(postId)}/views`, 
        {
          method: 'POST',
          requireAuth: false
        }
      );
    } catch (error) {
      // Silently fail for view tracking
      console.warn('Failed to increment post views:', error);
    }
  }

  // Admin methods (require authentication)
  static async createPost(postData: CreateBlogPostRequest): Promise<BlogPost> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.POSTS, 
      {
        method: 'POST',
        body: JSON.stringify(postData),
        requireAuth: true
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`Failed to create post: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async updatePost(postData: UpdateBlogPostRequest): Promise<BlogPost> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.POST_BY_ID(postData.id), 
      {
        method: 'PUT',
        body: JSON.stringify(postData),
        requireAuth: true
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      if (response.status === 404) {
        throw new Error('BLOG_POST_NOT_FOUND');
      }
      throw new Error(`Failed to update post: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  static async deletePost(postId: string): Promise<void> {
    const response = await ApiService.authenticatedFetch(
      this.BLOG_ENDPOINTS.POST_BY_ID(postId), 
      {
        method: 'DELETE',
        requireAuth: true
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      if (response.status === 404) {
        throw new Error('BLOG_POST_NOT_FOUND');
      }
      throw new Error(`Failed to delete post: ${response.statusText}`);
    }
  }

  // Newsletter subscription
  static async subscribeToNewsletter(email: string, locale: string = 'en'): Promise<void> {
    const response = await ApiService.authenticatedFetch(
      '/blog/newsletter/subscribe', 
      {
        method: 'POST',
        body: JSON.stringify({ email, locale }),
        requireAuth: false
      }
    );

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('EMAIL_ALREADY_SUBSCRIBED');
      }
      throw new Error(`Failed to subscribe to newsletter: ${response.statusText}`);
    }
  }
}
