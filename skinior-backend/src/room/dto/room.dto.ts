import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiPropertyOptional({
    description: 'Custom room name (optional - will be auto-generated if not provided)',
    example: 'skin-analysis-session-001',
  })
  @IsOptional()
  @IsString()
  roomName?: string;

  @ApiPropertyOptional({
    description: 'Preferred language for the session',
    example: 'english',
    enum: ['english', 'arabic'],
    default: 'arabic',
  })
  @IsOptional()
  @IsIn(['english', 'arabic'])
  language?: 'english' | 'arabic' = 'arabic';

  @ApiPropertyOptional({
    description: 'Session type for specialized analysis',
    example: 'general_analysis',
    enum: ['general_analysis', 'acne_analysis', 'anti_aging', 'sensitive_skin'],
    default: 'general_analysis',
  })
  @IsOptional()
  @IsIn(['general_analysis', 'acne_analysis', 'anti_aging', 'sensitive_skin'])
  sessionType?: string = 'general_analysis';
}

export class JoinRoomDto {
  @ApiProperty({
    description: 'Room name to join',
    example: 'skin-analysis-session-001',
  })
  @IsString()
  roomName: string;
}

export class LeaveRoomDto {
  @ApiProperty({
    description: 'Room name to leave',
    example: 'skin-analysis-session-001',
  })
  @IsString()
  roomName: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Room name for token refresh',
    example: 'skin-analysis-session-001',
  })
  @IsString()
  roomName: string;
}
