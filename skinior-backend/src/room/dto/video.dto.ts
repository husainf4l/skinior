import { IsString, IsUrl, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SaveVideoDto {
  @ApiProperty({
    description: 'URL of the recorded video file',
    example: 'https://storage.livekit.com/recordings/room_123/video.mp4',
  })
  @IsString()
  @IsUrl()
  videoUrl: string;

  @ApiPropertyOptional({
    description: 'Duration of the recording in seconds',
    example: 1800,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({
    description: 'File size in bytes',
    example: 52428800,
  })
  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @ApiPropertyOptional({
    description: 'Recording format',
    example: 'mp4',
  })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata about the recording',
    example: '{"resolution": "1080p", "bitrate": "2000kbps"}',
  })
  @IsOptional()
  metadata?: any;
}

export class GetVideoDto {
  @ApiProperty({
    description: 'Room name to get videos for',
    example: 'skincare-John-1737427200-abc123',
  })
  @IsString()
  roomName: string;
}
