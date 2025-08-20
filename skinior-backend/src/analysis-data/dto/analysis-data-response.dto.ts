import { ApiProperty } from '@nestjs/swagger';

export class AnalysisDataResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the analysis data',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User ID for the analysis data',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Analysis session ID',
    example: 'uuid',
  })
  analysisId: string;

  @ApiProperty({
    description: 'Type of analysis performed',
    example: 'skin_analysis',
  })
  analysisType: string;

  @ApiProperty({
    description: 'Analysis data payload',
    example: {
      skin_type: 'combination',
      concerns: ['acne', 'aging'],
      recommendations: [],
      routine: {},
      confidence_score: 0.95,
    },
  })
  data: Record<string, any>;

  @ApiProperty({
    description: 'Analysis timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  timestamp: Date;
}

export class AnalysisHistoryResponseDto {
  @ApiProperty({
    description: 'Analysis history data',
    type: [AnalysisDataResponseDto],
  })
  history: AnalysisDataResponseDto[];

  @ApiProperty({
    description: 'Total number of analysis records',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Number of records returned',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Number of records skipped',
    example: 0,
  })
  offset: number;
}

export class ProgressSummaryResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Total number of analyses performed',
    example: 5,
  })
  totalAnalyses: number;

  @ApiProperty({
    description: 'Date of first analysis',
    example: '2024-01-01T00:00:00Z',
  })
  firstAnalysis?: Date;

  @ApiProperty({
    description: 'Date of last analysis',
    example: '2024-01-15T00:00:00Z',
  })
  lastAnalysis?: Date;

  @ApiProperty({
    description: 'Progress timeline showing improvements over time',
    example: [
      {
        date: '2024-01-01',
        concerns: ['acne', 'aging'],
        skin_type: 'combination',
        confidence_score: 0.85,
      },
      {
        date: '2024-01-15',
        concerns: ['aging'],
        skin_type: 'combination',
        confidence_score: 0.92,
      },
    ],
  })
  progressTimeline: Array<{
    date: string;
    concerns: string[];
    skin_type: string;
    confidence_score: number;
  }>;

  @ApiProperty({
    description: 'Detected skin improvements over time',
    example: [
      {
        improvement: 'acne_reduction',
        progress: 0.75,
        timeline: ['2024-01-01', '2024-01-15'],
      },
    ],
  })
  skinImprovements: Array<{
    improvement: string;
    progress: number;
    timeline: string[];
  }>;

  @ApiProperty({
    description: 'Rate of following product recommendations',
    example: 0.75,
  })
  recommendationFollowRate: number;
}
