import { IsArray, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SkiniorProductDto {
  @ApiProperty({ description: 'Skinior product ID', example: 'skinior_123' })
  @IsString()
  skiniorId: string;

  @ApiProperty({ description: 'Product name', example: 'Advanced Hydrating Serum' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Product brand', example: 'Skinior' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Product category', example: 'serum' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product ingredients', example: ['Hyaluronic Acid', 'Vitamin C'] })
  @IsOptional()
  @IsArray()
  ingredients?: string[];

  @ApiPropertyOptional({ description: 'Product price', example: 45.99 })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Currency code', example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Product rating', example: 4.8 })
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ description: 'Review count', example: 1250 })
  @IsOptional()
  reviewCount?: number;

  @ApiPropertyOptional({ description: 'Product availability', example: true })
  @IsOptional()
  availability?: boolean;

  @ApiPropertyOptional({ description: 'Stock quantity', example: 50 })
  @IsOptional()
  stockQuantity?: number;

  @ApiPropertyOptional({ description: 'Product images', example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ description: 'Product URL', example: 'https://skinior.com/product/123' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Product SKU', example: 'SKU123' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Product weight in grams', example: 30.5 })
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Product dimensions' })
  @IsOptional()
  dimensions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Product tags', example: ['hydrating', 'anti-aging'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Suitable skin types', example: ['dry', 'combination'] })
  @IsOptional()
  @IsArray()
  skinType?: string[];

  @ApiPropertyOptional({ description: 'Addresses concerns', example: ['hydration', 'aging'] })
  @IsOptional()
  @IsArray()
  concerns?: string[];

  @ApiPropertyOptional({ description: 'Usage instructions' })
  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @ApiPropertyOptional({ description: 'Product warnings', example: ['For external use only'] })
  @IsOptional()
  @IsArray()
  warnings?: string[];
}

export class SyncSkiniorProductsDto {
  @ApiProperty({
    description: 'Array of products to sync',
    type: [SkiniorProductDto],
  })
  @IsArray()
  products: SkiniorProductDto[];

  @ApiPropertyOptional({
    description: 'Source identifier',
    example: 'skinior.com',
    default: 'skinior.com',
  })
  @IsOptional()
  @IsString()
  source?: string = 'skinior.com';

  @ApiProperty({
    description: 'Sync timestamp (ISO string)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  syncTimestamp: string;
}
