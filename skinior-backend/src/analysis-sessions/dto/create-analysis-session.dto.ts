import { IsString, IsOptional, IsObject, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalysisSessionDto {
  @ApiProperty({
    description: 'User ID for the analysis session',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Unique session identifier',
    example: 'session456',
  })
  @IsString()
  sessionId: string;

  @ApiPropertyOptional({
    description: 'Language for the analysis session',
    example: 'english',
    enum: ['english', 'arabic'],
    default: 'english',
  })
  @IsOptional()
  @IsIn(['english', 'arabic'])
  language?: string = 'english';

  @ApiPropertyOptional({
    description: 'Additional metadata for the session',
    example: {
      agent_version: 'agent16',
      analysis_type: 'advanced_skin_analysis',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
