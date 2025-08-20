import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductRecommendationDto {
  @ApiPropertyOptional({
    description: 'Recommendation status',
    example: 'purchased',
    enum: ['pending', 'purchased', 'tried', 'not_interested', 'wishlist'],
  })
  @IsOptional()
  @IsIn(['pending', 'purchased', 'tried', 'not_interested', 'wishlist'])
  status?: string;

  @ApiPropertyOptional({
    description: 'User notes about the product',
    example: 'Great product, really helped with hydration',
  })
  @IsOptional()
  @IsString()
  userNotes?: string;

  @ApiPropertyOptional({
    description: 'Updated reason for recommendation',
    example: 'Perfect for your skin type and concerns',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Updated usage instructions',
    example: 'Apply once daily in the evening',
  })
  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @ApiPropertyOptional({
    description: 'Updated recommendation priority',
    example: 'high',
    enum: ['high', 'medium', 'low'],
  })
  @IsOptional()
  @IsIn(['high', 'medium', 'low'])
  priority?: string;
}
