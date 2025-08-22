import {
  IsOptional,
  IsNumber,
  IsString,
  IsIn,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultationQueryDto {
  @ApiProperty({
    description: 'Number of consultations to return (1-100)',
    required: false,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({
    description: 'Pagination cursor for next page',
    required: false,
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiProperty({
    description: 'Filter by consultation status',
    required: false,
    enum: ['completed', 'in_progress', 'pending', 'cancelled', 'all'],
    default: 'all',
  })
  @IsOptional()
  @IsString()
  @IsIn(['completed', 'in_progress', 'pending', 'cancelled', 'all'])
  status?: string = 'all';

  @ApiProperty({
    description: 'Start date for filtering (ISO format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({
    description: 'End date for filtering (ISO format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}

export class RecommendationDto {
  @ApiProperty({ description: 'Recommendation ID' })
  id: string;

  @ApiProperty({ description: 'Recommendation title' })
  title: string;

  @ApiProperty({ description: 'Recommendation description' })
  description: string;

  @ApiProperty({ 
    description: 'Recommendation priority',
    enum: ['high', 'medium', 'low']
  })
  priority: 'high' | 'medium' | 'low';

  @ApiProperty({ description: 'Recommendation category' })
  category: string;
}

export class SkinAnalysisDto {
  @ApiProperty({ description: 'Hydration level (0-100)' })
  hydration: number;

  @ApiProperty({ description: 'Oiliness level (0-100)' })
  oiliness: number;

  @ApiProperty({ description: 'Elasticity level (0-100)' })
  elasticity: number;

  @ApiProperty({ description: 'Pigmentation level (0-100)' })
  pigmentation: number;

  @ApiProperty({ description: 'Texture level (0-100)' })
  texture: number;

  @ApiProperty({ description: 'Pores level (0-100)' })
  pores: number;
}

export class ConsultationSummaryDto {
  @ApiProperty({ description: 'Consultation ID' })
  id: string;

  @ApiProperty({ description: 'Type of analysis performed' })
  analysisType: string;

  @ApiProperty({ 
    description: 'Consultation status',
    enum: ['completed', 'in_progress', 'pending', 'cancelled']
  })
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';

  @ApiProperty({ description: 'Creation date (ISO format)' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date (ISO format)' })
  updatedAt: string;

  @ApiProperty({ description: 'Consultation duration in minutes' })
  duration: number;

  @ApiProperty({ 
    description: 'List of skin concerns identified',
    type: [String]
  })
  concerns: string[];

  @ApiProperty({ 
    description: 'List of recommendations',
    type: [RecommendationDto]
  })
  recommendations: RecommendationDto[];

  @ApiProperty({ 
    description: 'Skin analysis scores',
    type: SkinAnalysisDto
  })
  skinAnalysis: SkinAnalysisDto;

  @ApiProperty({ description: 'Improvement score (0-100)' })
  improvementScore: number;

  @ApiProperty({ description: 'Name of the advisor' })
  advisorName: string;

  @ApiProperty({ description: 'Consultation notes' })
  notes: string;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;
}

export class ProductRecommendationDto {
  @ApiProperty({ description: 'Product ID' })
  id: string;

  @ApiProperty({ description: 'Product name' })
  name: string;

  @ApiProperty({ description: 'Product brand' })
  brand: string;

  @ApiProperty({ description: 'Product price' })
  price: number;

  @ApiProperty({ 
    description: 'Recommendation priority',
    enum: ['high', 'medium', 'low']
  })
  priority: 'high' | 'medium' | 'low';

  @ApiProperty({ description: 'Reason for recommendation' })
  reason: string;

  @ApiProperty({ description: 'Product category' })
  category: string;
}

export class ConsultationDetailDto extends ConsultationSummaryDto {
  @ApiProperty({ description: 'Raw analysis data' })
  analysisData: any;

  @ApiProperty({ 
    description: 'Product recommendations',
    type: [ProductRecommendationDto]
  })
  productRecommendations: ProductRecommendationDto[];
}

export class PaginationDto {
  @ApiProperty({ description: 'Total number of consultations' })
  total: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Cursor for next page' })
  cursor: string | null;

  @ApiProperty({ description: 'Whether there are more items' })
  hasMore: boolean;
}

export class ConsultationsResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: {
    consultations: ConsultationSummaryDto[];
    pagination: PaginationDto;
  };

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: string;
}

export class ConsultationDetailResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: {
    consultation: ConsultationDetailDto;
  };

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: string;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'Success status (always false)' })
  success: boolean;

  @ApiProperty({ description: 'Error details' })
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
