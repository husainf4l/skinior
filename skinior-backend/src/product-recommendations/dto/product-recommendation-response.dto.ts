import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductRecommendationResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the recommendation',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Analysis session ID',
    example: 'uuid',
  })
  analysisId: string;

  @ApiProperty({
    description: 'Product identifier',
    example: 'prod_001',
  })
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Advanced Hydrating Serum',
  })
  productName: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Skinior',
  })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'serum',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Product ingredients',
    example: ['Hyaluronic Acid', 'Vitamin C'],
  })
  ingredients?: string[];

  @ApiPropertyOptional({
    description: 'Product price',
    example: 45.99,
  })
  price?: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  currency: string;

  @ApiPropertyOptional({
    description: 'Product rating',
    example: 4.8,
  })
  rating?: number;

  @ApiProperty({
    description: 'Number of reviews',
    example: 1250,
  })
  reviewCount: number;

  @ApiPropertyOptional({
    description: 'Reason for recommendation',
    example: 'Recommended for combination skin with acne concerns',
  })
  reason?: string;

  @ApiPropertyOptional({
    description: 'Usage instructions',
    example: 'Apply twice daily after cleansing',
  })
  usageInstructions?: string;

  @ApiProperty({
    description: 'Recommendation priority',
    example: 'high',
  })
  priority: string;

  @ApiProperty({
    description: 'Product availability',
    example: true,
  })
  availability: boolean;

  @ApiPropertyOptional({
    description: 'Skinior.com product URL',
    example: 'https://skinior.com/product/advanced-hydrating-serum',
  })
  skiniorUrl?: string;

  @ApiProperty({
    description: 'Recommendation status',
    example: 'pending',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'User notes about the product',
    example: 'Great product, really helped with hydration',
  })
  userNotes?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T01:00:00Z',
  })
  updatedAt: Date;
}

export class ProductRecommendationsListResponseDto {
  @ApiProperty({
    description: 'List of product recommendations',
    type: [ProductRecommendationResponseDto],
  })
  recommendations: ProductRecommendationResponseDto[];

  @ApiProperty({
    description: 'Total number of recommendations',
    example: 15,
  })
  total: number;

  @ApiProperty({
    description: 'Number of recommendations returned',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Number of recommendations skipped',
    example: 0,
  })
  offset: number;
}

export class RecommendationAnalyticsResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Total number of recommendations',
    example: 25,
  })
  totalRecommendations: number;

  @ApiProperty({
    description: 'Number of purchased products',
    example: 8,
  })
  purchasedCount: number;

  @ApiProperty({
    description: 'Number of tried products',
    example: 12,
  })
  triedCount: number;

  @ApiProperty({
    description: 'Number of products marked as not interested',
    example: 3,
  })
  notInterestedCount: number;

  @ApiProperty({
    description: 'Number of products in wishlist',
    example: 2,
  })
  wishlistCount: number;

  @ApiProperty({
    description: 'Purchase rate (purchased / total)',
    example: 0.32,
  })
  purchaseRate: number;

  @ApiProperty({
    description: 'Trial rate (tried / total)',
    example: 0.48,
  })
  trialRate: number;

  @ApiProperty({
    description: 'Top product categories by recommendations',
    example: [
      { category: 'serum', count: 8 },
      { category: 'moisturizer', count: 6 },
    ],
  })
  topCategories: Array<{ category: string; count: number }>;

  @ApiProperty({
    description: 'Top brands by recommendations',
    example: [
      { brand: 'Skinior', count: 12 },
      { brand: 'CeraVe', count: 5 },
    ],
  })
  topBrands: Array<{ brand: string; count: number }>;

  @ApiProperty({
    description: 'Average rating of recommended products',
    example: 4.2,
  })
  averageRating: number;
}
