import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiPropertyOptional({ 
    description: 'Order status', 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] 
  })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({ 
    description: 'Payment status', 
    enum: ['pending', 'paid', 'failed', 'cod_pending'] 
  })
  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed', 'cod_pending'])
  paymentStatus?: string;

  @ApiPropertyOptional({ description: 'Shipping address' })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiPropertyOptional({ description: 'Shipping city' })
  @IsOptional()
  @IsString()
  shippingCity?: string;

  @ApiPropertyOptional({ description: 'Shipping phone' })
  @IsOptional()
  @IsString()
  shippingPhone?: string;

  @ApiPropertyOptional({ description: 'COD notes' })
  @IsOptional()
  @IsString()
  codNotes?: string;

  @ApiPropertyOptional({ description: 'Shipping cost', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shipping?: number;

  @ApiPropertyOptional({ description: 'Tax amount', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;
}

export class OrderFilterDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Order status filter', 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'all'] 
  })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'all'])
  status?: string = 'all';

  @ApiPropertyOptional({ 
    description: 'Payment status filter', 
    enum: ['pending', 'paid', 'failed', 'cod_pending', 'all'] 
  })
  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed', 'cod_pending', 'all'])
  paymentStatus?: string = 'all';
}