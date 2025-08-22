import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsUUID, IsEnum, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product title in English' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Product title in Arabic' })
  @IsOptional()
  @IsString()
  titleAr?: string;

  @ApiPropertyOptional({ description: 'Product description in English' })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({ description: 'Product description in Arabic' })
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @ApiProperty({ description: 'Product price', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Compare at price for discounts', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'JOD' })
  @IsOptional()
  @IsString()
  currency?: string = 'JOD';

  @ApiPropertyOptional({ description: 'Product SKU' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Is product active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Is product featured', default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @ApiPropertyOptional({ description: 'Is product new', default: false })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean = false;

  @ApiPropertyOptional({ description: 'Active ingredients' })
  @IsOptional()
  @IsString()
  activeIngredients?: string;

  @ApiPropertyOptional({ description: 'Skin type compatibility' })
  @IsOptional()
  @IsString()
  skinType?: string;

  @ApiPropertyOptional({ description: 'Usage time (Morning, Night, AM/PM)' })
  @IsOptional()
  @IsString()
  usage?: string;

  @ApiPropertyOptional({ description: 'Product features array' })
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional({ description: 'Detailed ingredients list' })
  @IsOptional()
  @IsArray()
  ingredients?: string[];

  @ApiPropertyOptional({ description: 'How to use instructions' })
  @IsOptional()
  @IsString()
  howToUse?: string;

  @ApiPropertyOptional({ description: 'Arabic features array' })
  @IsOptional()
  @IsArray()
  featuresAr?: string[];

  @ApiPropertyOptional({ description: 'Arabic ingredients list' })
  @IsOptional()
  @IsArray()
  ingredientsAr?: string[];

  @ApiPropertyOptional({ description: 'Arabic usage instructions' })
  @IsOptional()
  @IsString()
  howToUseAr?: string;

  @ApiPropertyOptional({ description: 'SEO meta title' })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Stock quantity', minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number = 0;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Skin concerns this product addresses' })
  @IsOptional()
  @IsArray()
  concerns?: string[];
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product title in English' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Product title in Arabic' })
  @IsOptional()
  @IsString()
  titleAr?: string;

  @ApiPropertyOptional({ description: 'Product description in English' })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({ description: 'Product description in Arabic' })
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @ApiPropertyOptional({ description: 'Product price', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Compare at price for discounts', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Product SKU' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Is product active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Is product featured' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Is product new' })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @ApiPropertyOptional({ description: 'Active ingredients' })
  @IsOptional()
  @IsString()
  activeIngredients?: string;

  @ApiPropertyOptional({ description: 'Skin type compatibility' })
  @IsOptional()
  @IsString()
  skinType?: string;

  @ApiPropertyOptional({ description: 'Usage time' })
  @IsOptional()
  @IsString()
  usage?: string;

  @ApiPropertyOptional({ description: 'Product features array' })
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional({ description: 'Detailed ingredients list' })
  @IsOptional()
  @IsArray()
  ingredients?: string[];

  @ApiPropertyOptional({ description: 'How to use instructions' })
  @IsOptional()
  @IsString()
  howToUse?: string;

  @ApiPropertyOptional({ description: 'Arabic features array' })
  @IsOptional()
  @IsArray()
  featuresAr?: string[];

  @ApiPropertyOptional({ description: 'Arabic ingredients list' })
  @IsOptional()
  @IsArray()
  ingredientsAr?: string[];

  @ApiPropertyOptional({ description: 'Arabic usage instructions' })
  @IsOptional()
  @IsString()
  howToUseAr?: string;

  @ApiPropertyOptional({ description: 'SEO meta title' })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Stock quantity', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Skin concerns this product addresses' })
  @IsOptional()
  @IsArray()
  concerns?: string[];
}

export class ProductFilterDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Category ID filter' })
  @IsOptional()
  @IsUUID()
  category?: string;

  @ApiPropertyOptional({ description: 'Brand ID filter' })
  @IsOptional()
  @IsUUID()
  brand?: string;

  @ApiPropertyOptional({ description: 'Status filter', enum: ['active', 'inactive', 'all'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'all'])
  status?: 'active' | 'inactive' | 'all' = 'all';

  @ApiPropertyOptional({ description: 'Featured products filter' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'In stock filter' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  inStock?: boolean;
}

export class ProductImageUploadDto {
  @ApiPropertyOptional({ description: 'Array of alt texts for images' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  altTexts?: string[];

  @ApiPropertyOptional({ description: 'Array indicating which images are main' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(v => v === 'true' || v === true);
    }
    return [];
  })
  @IsBoolean({ each: true })
  isMain?: boolean[];
}