import { IsString, IsOptional, IsBoolean, IsArray, IsUUID, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBlogPostDto {
  @IsString()
  titleEn: string;

  @IsString()
  titleAr: string;

  @IsString()
  excerptEn: string;

  @IsString()
  excerptAr: string;

  @IsString()
  contentEn: string;

  @IsString()
  contentAr: string;

  @IsString()
  featuredImage: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsUUID()
  categoryId: string;

  @IsUUID()
  authorId: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  seoTitleEn?: string;

  @IsOptional()
  @IsString()
  seoTitleAr?: string;

  @IsOptional()
  @IsString()
  seoDescriptionEn?: string;

  @IsOptional()
  @IsString()
  seoDescriptionAr?: string;
}

export class UpdateBlogPostDto {
  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  excerptEn?: string;

  @IsOptional()
  @IsString()
  excerptAr?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsString()
  contentAr?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  seoTitleEn?: string;

  @IsOptional()
  @IsString()
  seoTitleAr?: string;

  @IsOptional()
  @IsString()
  seoDescriptionEn?: string;

  @IsOptional()
  @IsString()
  seoDescriptionAr?: string;
}

export class BlogPostQueryDto {
  @IsOptional()
  @IsUUID()
  category?: string;

  @IsOptional()
  @IsUUID()
  author?: string;

  @IsOptional()
  @IsUUID()
  tag?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sortBy?: 'publishedAt' | 'views' | 'likes' | 'title' = 'publishedAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  // Date range filtering
  @IsOptional()
  @IsString()
  dateRangeStart?: string; // ISO date string

  @IsOptional()
  @IsString()
  dateRangeEnd?: string; // ISO date string

  // Read time range filtering
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  readTimeMin?: number; // in minutes

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  readTimeMax?: number; // in minutes

  // Alternative: Support JSON string format for backward compatibility
  @IsOptional()
  @IsString()
  dateRange?: string; // JSON string: {"start": "2024-01-01", "end": "2024-12-31"}

  @IsOptional()
  @IsString()
  readTimeRange?: string; // JSON string: {"min": 1, "max": 10}
}

export class BlogPostSearchDto {
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  locale?: 'en' | 'ar' = 'en';

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}

export class BlogPostResponseDto {
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
  category: any;
  author: any;
  tags: any[];
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