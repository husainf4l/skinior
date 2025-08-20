import { IsString, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductSearchDto {
  @ApiProperty({
    description: 'Search query',
    example: 'hydrating serum',
  })
  @IsString()
  query: string;

  @ApiPropertyOptional({
    description: 'Product category filter',
    example: 'serum',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Price range filter',
    example: 'medium',
    enum: ['low', 'medium', 'high'],
  })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({
    description: 'Minimum rating filter',
    example: 4.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Transform(({ value }) => parseFloat(value))
  ratingMin?: number;

  @ApiPropertyOptional({
    description: 'Brand filter',
    example: 'Skinior',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Skin type filters',
    example: ['dry', 'combination'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skinType?: string[];

  @ApiPropertyOptional({
    description: 'Concern filters',
    example: ['acne', 'aging'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  concerns?: string[];

  @ApiPropertyOptional({
    description: 'Only show available products',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  availableOnly?: boolean = true;

  @ApiPropertyOptional({
    description: 'Number of results to return',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of results to skip',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'rating_desc',
    enum: ['rating_desc', 'rating_asc', 'price_desc', 'price_asc', 'newest', 'oldest'],
    default: 'rating_desc',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'rating_desc';
}

export class ProductAvailabilityFiltersDto {
  @ApiPropertyOptional({
    description: 'Skin type filter',
    example: 'combination',
  })
  @IsOptional()
  @IsString()
  skinType?: string;

  @ApiPropertyOptional({
    description: 'Concerns filter (comma-separated)',
    example: 'acne,aging',
  })
  @IsOptional()
  @IsString()
  concerns?: string;

  @ApiPropertyOptional({
    description: 'Budget range filter',
    example: 'medium',
    enum: ['low', 'medium', 'high'],
  })
  @IsOptional()
  @IsString()
  budgetRange?: string;

  @ApiPropertyOptional({
    description: 'Source filter',
    example: 'skinior.com',
    default: 'skinior.com',
  })
  @IsOptional()
  @IsString()
  source?: string = 'skinior.com';

  @ApiPropertyOptional({
    description: 'Number of results to return',
    example: 15,
    default: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 15;

  @ApiPropertyOptional({
    description: 'Number of results to skip',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  offset?: number = 0;
}
