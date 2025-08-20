import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalysisSessionResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the analysis session',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User ID for the analysis session',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Unique session identifier',
    example: 'session456',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Language for the analysis session',
    example: 'english',
  })
  language: string;

  @ApiProperty({
    description: 'Status of the analysis session',
    example: 'completed',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the session',
    example: {
      agent_version: 'agent16',
      analysis_type: 'advanced_skin_analysis',
    },
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T01:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Completion timestamp',
    example: '2024-01-01T01:00:00Z',
  })
  completedAt?: Date;
}
