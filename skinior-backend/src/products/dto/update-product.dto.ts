import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';

// DTO for updating product images (all fields optional)
export class UpdateProductImageDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @IsOptional()
  @IsBoolean()
  isHover?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  // Skincare specific
  @IsOptional()
  @IsString()
  activeIngredients?: string;

  @IsOptional()
  @IsString()
  skinType?: string;

  // Structured fields
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  concerns?: string[];

  @IsOptional()
  @IsString()
  usage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  howToUse?: string[];

  @IsOptional()
  @IsString()
  featuresAr?: string;

  @IsOptional()
  @IsString()
  ingredientsAr?: string;

  @IsOptional()
  @IsString()
  howToUseAr?: string;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  viewCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  salesCount?: number;

  // Relations
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  // Images - nested DTO
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  images?: UpdateProductImageDto[];

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra?: any;
}
