import { 
  IsString, 
  IsArray, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsUUID, 
  IsIn,
  Min,
  Max,
  ArrayNotEmpty 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductRecommendationItemDto {
  @ApiProperty({
    description: 'Product identifier',
    example: 'prod_001',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Advanced Hydrating Serum',
  })
  @IsString()
  productName: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Skinior',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'serum',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Product ingredients',
    example: ['Hyaluronic Acid', 'Vitamin C'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiPropertyOptional({
    description: 'Product price',
    example: 45.99,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiPropertyOptional({
    description: 'Product rating',
    example: 4.8,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Number of reviews',
    example: 1250,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number = 0;

  @ApiPropertyOptional({
    description: 'Reason for recommendation',
    example: 'Recommended for combination skin with acne concerns',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Usage instructions',
    example: 'Apply twice daily after cleansing',
  })
  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @ApiPropertyOptional({
    description: 'Recommendation priority',
    example: 'high',
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  })
  @IsOptional()
  @IsIn(['high', 'medium', 'low'])
  priority?: string = 'medium';

  @ApiPropertyOptional({
    description: 'Product availability',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  availability?: boolean = true;

  @ApiPropertyOptional({
    description: 'Skinior.com product URL',
    example: 'https://skinior.com/product/advanced-hydrating-serum',
  })
  @IsOptional()
  @IsString()
  skiniorUrl?: string;
}

export class CreateProductRecommendationsDto {
  @ApiProperty({
    description: 'User ID for the recommendations',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Analysis session ID',
    example: 'uuid',
  })
  @IsUUID()
  analysisId: string;

  @ApiProperty({
    description: 'List of product recommendations',
    type: [ProductRecommendationItemDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  recommendations: ProductRecommendationItemDto[];

  @ApiPropertyOptional({
    description: 'Skin analysis data that generated these recommendations',
    example: {
      skin_type: 'combination',
      concerns: ['acne', 'aging'],
      confidence_score: 0.95,
    },
  })
  @IsOptional()
  skinAnalysis?: Record<string, any>;
}
