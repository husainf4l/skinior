import { IsString, IsOptional, IsObject, IsIn, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAnalysisSessionDto {
  @ApiPropertyOptional({
    description: 'Status of the analysis session',
    example: 'completed',
    enum: ['in_progress', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsIn(['in_progress', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Language for the analysis session',
    example: 'english',
    enum: ['english', 'arabic'],
  })
  @IsOptional()
  @IsIn(['english', 'arabic'])
  language?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the session',
    example: {
      completion_reason: 'user_finished',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Completion timestamp (ISO string)',
    example: '2024-01-01T01:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
