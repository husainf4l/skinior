import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentUserDto {
  @ApiProperty({
    description: 'Agent identifier/name',
    example: 'agent16',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Agent email (should be unique)',
    example: 'agent16@skinior.ai',
  })
  @IsString()
  email: string;

  @ApiPropertyOptional({
    description: 'Agent description',
    example: 'Agent16 Skin Analysis System',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Token expiration date (ISO string). If not provided, token will be long-term (6 months)',
    example: '2025-06-30T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class AgentTokenResponseDto {
  @ApiProperty({
    description: 'Agent user ID',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Agent email',
    example: 'agent16@skinior.ai',
  })
  email: string;

  @ApiProperty({
    description: 'Agent role',
    example: 'agent',
  })
  role: string;

  @ApiProperty({
    description: 'Long-term JWT token for agent authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'API key for alternative authentication',
    example: 'sk_agent16_1234567890abcdef',
  })
  apiKey: string;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: '2025-12-31T23:59:59Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Token creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;
}

export class RefreshAgentTokenDto {
  @ApiProperty({
    description: 'Agent ID',
    example: 'uuid',
  })
  @IsString()
  agentId: string;

  @ApiPropertyOptional({
    description: 'New token expiration date (ISO string)',
    example: '2025-06-30T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
