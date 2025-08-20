import { IsString, IsObject, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnalysisDataDto {
  @ApiProperty({
    description: 'User ID for the analysis data',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Analysis session ID',
    example: 'uuid',
  })
  @IsUUID()
  analysisId: string;

  @ApiProperty({
    description: 'Type of analysis performed',
    example: 'skin_analysis',
    enum: [
      'skin_analysis',
      'acne_analysis',
      'aging_analysis',
      'pigmentation_analysis',
      'hydration_analysis',
      'sensitivity_analysis',
      'routine_recommendation',
    ],
  })
  @IsString()
  analysisType: string;

  @ApiProperty({
    description: 'Analysis data payload',
    example: {
      skin_type: 'combination',
      concerns: ['acne', 'aging'],
      recommendations: [
        {
          type: 'cleanser',
          priority: 'high',
          reason: 'Remove excess oil and impurities',
        },
      ],
      routine: {
        morning: ['cleanser', 'toner', 'moisturizer', 'sunscreen'],
        evening: ['cleanser', 'treatment', 'moisturizer'],
      },
      confidence_score: 0.95,
      analysis_metadata: {
        image_quality: 'high',
        lighting_conditions: 'good',
        face_detection_confidence: 0.98,
      },
    },
  })
  @IsObject()
  data: Record<string, any>;
}
