export interface BlogAuthor {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  avatar: string;
  bio: {
    en: string;
    ar: string;
  };
  email?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BlogCategory {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  slug: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  color?: string;
}

export interface BlogTag {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  slug: {
    en: string;
    ar: string;
  };
}

export interface BlogPost {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  slug: {
    en: string;
    ar: string;
  };
  excerpt: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
  featuredImage: string;
  images?: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: {
    en: string;
    ar: string;
  };
  category: BlogCategory;
  author: BlogAuthor;
  tags: BlogTag[];
  featured: boolean;
  published: boolean;
  seoTitle?: {
    en: string;
    ar: string;
  };
  seoDescription?: {
    en: string;
    ar: string;
  };
  views?: number;
  likes?: number;
  commentsCount?: number;
}

export interface BlogFilters {
  category?: string;
  categories?: string[];
  author?: string;
  authors?: string[];
  tag?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  search?: string;
  query?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'publishedAt' | 'views' | 'likes' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  dateRange?: {
    start?: string;
    end?: string;
  };
  readTimeRange?: {
    min?: number;
    max?: number;
  };
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  hasMore: boolean;
  categories: BlogCategory[];
  popularTags: BlogTag[];
}

export interface BlogComment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    email?: string;
  };
  postId: string;
  parentId?: string;
  createdAt: string;
  likes: number;
  replies?: BlogComment[];
}

export interface CreateBlogPostRequest {
  title: {
    en: string;
    ar: string;
  };
  excerpt: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
  featuredImage: string;
  categoryId: string;
  tagIds: string[];
  featured?: boolean;
  published?: boolean;
  seoTitle?: {
    en: string;
    ar: string;
  };
  seoDescription?: {
    en: string;
    ar: string;
  };
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
  id: string;
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  popularPosts: BlogPost[];
  recentPosts: BlogPost[];
  topCategories: (BlogCategory & { postCount: number })[];
}
