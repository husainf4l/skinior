import { IsString, IsBoolean, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductAvailabilityDto {
  @ApiProperty({
    description: 'Product availability status',
    example: true,
  })
  @IsBoolean()
  available: boolean;

  @ApiPropertyOptional({
    description: 'Current stock quantity',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({
    description: 'Current price',
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

  @ApiProperty({
    description: 'Last availability check timestamp (ISO string)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  lastChecked: string;

  @ApiPropertyOptional({
    description: 'Data source',
    example: 'skinior.com',
    default: 'skinior.com',
  })
  @IsOptional()
  @IsString()
  source?: string = 'skinior.com';
}

export class UpdateProductAvailabilityDto {
  @ApiProperty({
    description: 'Product identifier',
    example: 'prod_001',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Availability information',
    type: ProductAvailabilityDto,
  })
  availability: ProductAvailabilityDto;

  @ApiProperty({
    description: 'Update timestamp (ISO string)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  updatedAt: string;
}
