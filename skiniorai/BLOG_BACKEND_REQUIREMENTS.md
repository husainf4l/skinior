# Blog Backend API Requirements

## Overview

This document outlines the backend API requirements for the Skinior blog system. The frontend is built with TypeScript/React and expects a RESTful API with specific endpoints and data structures.

## Base URL

```
https://yourdomain.com/api
```

## Authentication

Most endpoints are public (no authentication required), but some require JWT authentication:

- **Public endpoints**: Blog posts, categories, tags, comments (read)
- **Protected endpoints**: Like posts, add comments, admin functions
- **Admin endpoints**: Create/update/delete posts, manage categories/tags

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

## Data Models

### BlogPost
```typescript
interface BlogPost {
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
  publishedAt: string; // ISO 8601 format
  updatedAt: string;   // ISO 8601 format
  readTime: {
    en: string; // e.g., "5 min read"
    ar: string; // e.g., "5 دقائق قراءة"
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
```

### BlogCategory
```typescript
interface BlogCategory {
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
  color?: string; // hex color for UI
}
```

### BlogAuthor
```typescript
interface BlogAuthor {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  avatar: string; // URL to image
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
```

### BlogTag
```typescript
interface BlogTag {
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
```

### BlogComment
```typescript
interface BlogComment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    email?: string;
  };
  postId: string;
  parentId?: string; // for nested comments
  createdAt: string; // ISO 8601 format
  likes: number;
  replies?: BlogComment[];
}
```

## API Endpoints

### 1. Get Blog Posts
```
GET /blog/posts
```

**Query Parameters:**
- `category` (optional): Filter by category ID
- `author` (optional): Filter by author ID
- `tag` (optional): Filter by tag ID
- `featured` (optional): boolean - filter featured posts
- `published` (optional): boolean - filter published posts (default: true)
- `search` (optional): Search in title and content
- `limit` (optional): Number of posts per page (default: 10)
- `offset` (optional): Pagination offset (default: 0)
- `sortBy` (optional): 'publishedAt' | 'views' | 'likes' | 'title' (default: 'publishedAt')
- `sortOrder` (optional): 'asc' | 'desc' (default: 'desc')

**Response:**
```json
{
  "data": {
    "posts": [BlogPost[]],
    "total": number,
    "hasMore": boolean,
    "categories": [BlogCategory[]],
    "popularTags": [BlogTag[]]
  }
}
```

### 2. Get Single Blog Post
```
GET /blog/posts/{id}
```

**Response:**
```json
{
  "data": BlogPost
}
```

### 3. Get Post by Slug
```
GET /blog/posts/slug/{slug}?locale=en
```

**Query Parameters:**
- `locale`: 'en' | 'ar' (required)

**Response:**
```json
{
  "data": BlogPost
}
```

### 4. Get Featured Posts
```
GET /blog/posts/featured?limit=5
```

**Response:**
```json
{
  "data": [BlogPost[]]
}
```

### 5. Search Posts
```
GET /blog/search?q={query}&locale=en&limit=10
```

**Query Parameters:**
- `q`: Search query (required)
- `locale`: 'en' | 'ar' (optional, default: 'en')
- `limit`: Number of results (optional, default: 10)

**Response:**
```json
{
  "data": [BlogPost[]]
}
```

### 6. Get Related Posts
```
GET /blog/posts/{id}/related?limit=3
```

**Response:**
```json
{
  "data": [BlogPost[]]
}
```

### 7. Get Categories
```
GET /blog/categories
```

**Response:**
```json
{
  "data": [BlogCategory[]]
}
```

### 8. Get Tags
```
GET /blog/tags
```

**Response:**
```json
{
  "data": [BlogTag[]]
}
```

### 9. Get Blog Stats
```
GET /blog/stats
```

**Response:**
```json
{
  "data": {
    "totalPosts": number,
    "totalViews": number,
    "totalLikes": number,
    "totalComments": number,
    "popularPosts": [BlogPost[]],
    "recentPosts": [BlogPost[]],
    "topCategories": [BlogCategory & { postCount: number }]
  }
}
```

### 10. Get Comments
```
GET /blog/posts/{postId}/comments
```

**Response:**
```json
{
  "data": [BlogComment[]]
}
```

### 11. Add Comment (Protected)
```
POST /blog/posts/{postId}/comments
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "content": "string",
  "parentId": "string" // optional for replies
}
```

**Response:**
```json
{
  "data": BlogComment
}
```

### 12. Like Post (Protected)
```
POST /blog/posts/{postId}/like
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "liked": boolean,
    "likesCount": number
  }
}
```

### 13. Increment Views
```
POST /blog/posts/{postId}/views
```

**Response:**
```json
{
  "success": true
}
```

### 14. Newsletter Subscription
```
POST /blog/newsletter/subscribe
```

**Body:**
```json
{
  "email": "string",
  "locale": "en" | "ar"
}
```

**Response:**
```json
{
  "success": true
}
```

**Error Response (409 - Email already subscribed):**
```json
{
  "error": "EMAIL_ALREADY_SUBSCRIBED",
  "message": "This email is already subscribed to our newsletter"
}
```

## Admin Endpoints (Protected)

### 15. Create Post
```
POST /blog/posts
```

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": {
    "en": "string",
    "ar": "string"
  },
  "excerpt": {
    "en": "string",
    "ar": "string"
  },
  "content": {
    "en": "string",
    "ar": "string"
  },
  "featuredImage": "string",
  "categoryId": "string",
  "tagIds": ["string[]"],
  "featured": boolean,
  "published": boolean,
  "seoTitle": {
    "en": "string",
    "ar": "string"
  },
  "seoDescription": {
    "en": "string",
    "ar": "string"
  }
}
```

**Response:**
```json
{
  "data": BlogPost
}
```

### 16. Update Post
```
PUT /blog/posts/{id}
```

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Body:** Same as create post

**Response:**
```json
{
  "data": BlogPost
}
```

### 17. Delete Post
```
DELETE /blog/posts/{id}
```

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "success": true
}
```

## Error Responses

### Common Error Format
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "details": {} // optional additional details
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `422` - Unprocessable Entity (validation errors)
- `500` - Internal Server Error

### Error Codes
- `BLOG_POST_NOT_FOUND` - Post doesn't exist
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `EMAIL_ALREADY_SUBSCRIBED` - Newsletter subscription conflict
- `VALIDATION_ERROR` - Invalid input data

## Database Considerations

### Tables/Collections Needed

1. **blog_posts**
   - id, title_en, title_ar, slug_en, slug_ar
   - excerpt_en, excerpt_ar, content_en, content_ar
   - featured_image, published_at, updated_at
   - author_id, category_id, featured, published
   - seo_title_en, seo_title_ar, seo_description_en, seo_description_ar
   - views, likes, comments_count

2. **blog_categories**
   - id, name_en, name_ar, slug_en, slug_ar
   - description_en, description_ar, color

3. **blog_authors**
   - id, name_en, name_ar, avatar, bio_en, bio_ar
   - email, social_links (JSON)

4. **blog_tags**
   - id, name_en, name_ar, slug_en, slug_ar

5. **blog_post_tags** (many-to-many)
   - post_id, tag_id

6. **blog_comments**
   - id, content, post_id, author_name, author_avatar
   - author_email, parent_id, created_at, likes

7. **blog_post_likes**
   - id, post_id, user_id, created_at

8. **blog_newsletter_subscribers**
   - id, email, locale, subscribed_at, active

### Indexing Recommendations
- Index on `published_at` for sorting
- Index on `featured` and `published` for filtering
- Full-text search index on title and content fields
- Index on category_id and tag relationships
- Index on post_id for comments

## Performance Considerations

1. **Caching**: Implement Redis caching for frequently accessed data
2. **Pagination**: Always implement proper pagination for list endpoints
3. **Image Optimization**: Serve optimized images (WebP, different sizes)
4. **CDN**: Use CDN for static assets and images
5. **Database Optimization**: Implement proper indexing and query optimization

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on all endpoints
2. **Input Validation**: Validate and sanitize all inputs
3. **XSS Protection**: Sanitize HTML content before storing/serving
4. **CORS**: Configure proper CORS headers
5. **JWT Security**: Use secure JWT tokens with proper expiration

## Implementation Notes

1. **Slug Generation**: Auto-generate SEO-friendly slugs from titles
2. **Read Time Calculation**: Auto-calculate reading time based on content length
3. **Content Sanitization**: Sanitize HTML content for security
4. **Image Uploads**: Implement secure image upload with validation
5. **Backup Strategy**: Regular database backups for content protection

## Example Implementation (Node.js/Express)

```javascript
// Example endpoint implementation
app.get('/api/blog/posts', async (req, res) => {
  try {
    const { 
      category, 
      limit = 10, 
      offset = 0, 
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      featured,
      published = true 
    } = req.query;

    const posts = await BlogPost.findAndCountAll({
      where: {
        published: published === 'true',
        ...(featured && { featured: featured === 'true' }),
        ...(category && { categoryId: category })
      },
      include: [
        { model: BlogCategory, as: 'category' },
        { model: BlogAuthor, as: 'author' },
        { model: BlogTag, as: 'tags' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    const categories = await BlogCategory.findAll();
    const popularTags = await BlogTag.findAll({
      limit: 10,
      // Add logic for popular tags
    });

    res.json({
      data: {
        posts: posts.rows,
        total: posts.count,
        hasMore: (parseInt(offset) + parseInt(limit)) < posts.count,
        categories,
        popularTags
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch blog posts'
    });
  }
});
```

This comprehensive API specification should provide everything needed to implement a robust blog backend that works seamlessly with the enhanced frontend.
