import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AgentAuthService } from './agent-auth.service';
import { CreateAgentUserDto, AgentTokenResponseDto, RefreshAgentTokenDto } from './dto/agent-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('Agent Authentication')
@Controller('auth/agents')
export class AgentAuthController {
  constructor(private readonly agentAuthService: AgentAuthService) {}

  @Post()
  @Public()
  @ApiOperation({ 
    summary: 'Create agent system user',
    description: 'Creates a new agent system user with long-term authentication token'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Agent user created successfully with token',
    type: AgentTokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Agent user already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createAgent(@Body() createDto: CreateAgentUserDto): Promise<{
    success: boolean;
    data: AgentTokenResponseDto;
    message: string;
    timestamp: string;
  }> {
    const agentUser = await this.agentAuthService.createAgentUser(createDto);
    return {
      success: true,
      data: agentUser,
      message: 'Agent user created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Refresh agent token',
    description: 'Refreshes the authentication token for an agent user'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agent token refreshed successfully',
    type: AgentTokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agent user not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to refresh token',
  })
  async refreshToken(@Body() refreshDto: RefreshAgentTokenDto): Promise<{
    success: boolean;
    data: AgentTokenResponseDto;
    message: string;
    timestamp: string;
  }> {
    const refreshedToken = await this.agentAuthService.refreshAgentToken(refreshDto);
    return {
      success: true,
      data: refreshedToken,
      message: 'Agent token refreshed successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all agent users',
    description: 'Retrieves all agent system users and their details'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agent users retrieved successfully',
  })
  async getAgents(): Promise<{
    success: boolean;
    data: Array<{
      id: string;
      email: string;
      name: string;
      role: string;
      isActive: boolean;
      apiKey: string;
      expiresAt?: Date;
      createdAt: Date;
    }>;
    message: string;
    timestamp: string;
  }> {
    const agents = await this.agentAuthService.getAgentUsers();
    return {
      success: true,
      data: agents,
      message: 'Agent users retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':agentId/deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Deactivate agent user',
    description: 'Deactivates an agent user and invalidates their tokens'
  })
  @ApiParam({
    name: 'agentId',
    description: 'Agent user ID',
    example: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Agent deactivated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agent user not found',
  })
  async deactivateAgent(@Param('agentId') agentId: string): Promise<void> {
    await this.agentAuthService.deactivateAgent(agentId);
  }

  @Post('validate')
  @Public()
  @ApiOperation({ 
    summary: 'Validate agent authentication',
    description: 'Validates agent token or API key for authentication testing'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token validation result',
  })
  async validateAuth(@Body() body: { token?: string; apiKey?: string }): Promise<{
    success: boolean;
    data: {
      valid: boolean;
      user?: any;
      message: string;
    };
    timestamp: string;
  }> {
    let user = null;
    let valid = false;
    let message = 'Invalid authentication';

    if (body.token) {
      user = await this.agentAuthService.validateAgentToken(body.token);
      if (user) {
        valid = true;
        message = 'Token is valid';
      } else {
        message = 'Invalid or expired token';
      }
    } else if (body.apiKey) {
      user = await this.agentAuthService.validateApiKey(body.apiKey);
      if (user) {
        valid = true;
        message = 'API key is valid';
      } else {
        message = 'Invalid or expired API key';
      }
    } else {
      message = 'Token or API key required';
    }

    return {
      success: true,
      data: {
        valid,
        user: valid ? user : undefined,
        message,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
