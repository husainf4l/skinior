import { IsOptional, IsString, IsNumber, IsDateString, IsEnum, IsBoolean, Min, Max, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class DateRangeDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class AnalyticsDto extends DateRangeDto {
  @IsOptional()
  @IsEnum(['day', 'week', 'month', 'year'])
  period?: 'day' | 'week' | 'month' | 'year' = 'day';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metrics?: string[];
}

export class InventoryFilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsEnum(['in_stock', 'low_stock', 'out_of_stock'])
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;
}

export class CustomerFilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['customer', 'admin'])
  role?: 'customer' | 'admin';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  registeredAfter?: string;

  @IsOptional()
  @IsDateString()
  registeredBefore?: string;
}

export class OrderFilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

  @IsOptional()
  @IsEnum(['stripe', 'cod'])
  paymentMethod?: 'stripe' | 'cod';

  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed', 'cod_pending'])
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'cod_pending';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
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
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

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

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class DashboardOverviewDto {
  @IsOptional()
  @IsEnum(['7d', '30d', '90d'])
  range?: '7d' | '30d' | '90d' = '7d';
}

// Response DTOs for type safety - User-focused personal dashboard
export class PersonalStatsDto {
  myConsultations: number;
  myActiveTreatments: number;
  skinImprovementRate: number;
  avgImprovementScore: number;
}

export class MyTreatmentSummaryDto {
  id: string;
  name: string;
  progress: number;
  status: string;
  startDate: Date;
  currentWeek: number;
  nextMilestone: string;
}

export class MyConsultationSummaryDto {
  id: string;
  concerns: string[];
  createdAt: Date;
  status: string;
}

export class DashboardOverviewResponseDto {
  personalStats: PersonalStatsDto;
  myActiveTreatments: MyTreatmentSummaryDto[];
  myRecentConsultations: MyConsultationSummaryDto[];
  recommendedProductsCount: number;
  favoritesCount: number;
  myCollectionValue: number;
}