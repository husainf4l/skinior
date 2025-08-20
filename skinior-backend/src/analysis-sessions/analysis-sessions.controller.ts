import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalysisSessionsService } from './analysis-sessions.service';
import { CreateAnalysisSessionDto } from './dto/create-analysis-session.dto';
import { UpdateAnalysisSessionDto } from './dto/update-analysis-session.dto';
import { AnalysisSessionResponseDto } from './dto/analysis-session-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analysis Sessions')
@Controller('analysis-sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalysisSessionsController {
  constructor(private readonly analysisSessionsService: AnalysisSessionsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new analysis session',
    description: 'Creates a new analysis session for Agent16 integration'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Analysis session created successfully',
    type: AnalysisSessionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Session ID already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createDto: CreateAnalysisSessionDto): Promise<{
    success: boolean;
    data: AnalysisSessionResponseDto;
    message: string;
    timestamp: string;
  }> {
    const session = await this.analysisSessionsService.create(createDto);
    return {
      success: true,
      data: session,
      message: 'Analysis session created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':sessionId')
  @ApiOperation({ 
    summary: 'Get analysis session by session ID',
    description: 'Retrieves an analysis session with its related data'
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Unique session identifier',
    example: 'session456',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analysis session retrieved successfully',
    type: AnalysisSessionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Analysis session not found',
  })
  async findOne(@Param('sessionId') sessionId: string): Promise<{
    success: boolean;
    data: AnalysisSessionResponseDto;
    message: string;
    timestamp: string;
  }> {
    const session = await this.analysisSessionsService.findBySessionId(sessionId);
    return {
      success: true,
      data: session,
      message: 'Analysis session retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Get analysis sessions by user ID',
    description: 'Retrieves all analysis sessions for a specific user with pagination'
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user123',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of sessions to return',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Number of sessions to skip',
    example: 0,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analysis sessions retrieved successfully',
  })
  async findByUser(
    @Param('userId') userId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ): Promise<{
    success: boolean;
    data: {
      sessions: AnalysisSessionResponseDto[];
      total: number;
      limit: number;
      offset: number;
    };
    message: string;
    timestamp: string;
  }> {
    const result = await this.analysisSessionsService.findByUserId(
      userId,
      parseInt(limit, 10),
      parseInt(offset, 10),
    );

    return {
      success: true,
      data: result,
      message: 'Analysis sessions retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':sessionId')
  @ApiOperation({ 
    summary: 'Update analysis session',
    description: 'Updates an existing analysis session'
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Unique session identifier',
    example: 'session456',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analysis session updated successfully',
    type: AnalysisSessionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Analysis session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('sessionId') sessionId: string,
    @Body() updateDto: UpdateAnalysisSessionDto,
  ): Promise<{
    success: boolean;
    data: AnalysisSessionResponseDto;
    message: string;
    timestamp: string;
  }> {
    const session = await this.analysisSessionsService.update(sessionId, updateDto);
    return {
      success: true,
      data: session,
      message: 'Analysis session updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete analysis session',
    description: 'Deletes an analysis session and all related data'
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Unique session identifier',
    example: 'session456',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Analysis session deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Analysis session not found',
  })
  async remove(@Param('sessionId') sessionId: string): Promise<void> {
    await this.analysisSessionsService.delete(sessionId);
  }

  @Get('user/:userId/stats')
  @ApiOperation({ 
    summary: 'Get user analysis session statistics',
    description: 'Retrieves statistical information about user analysis sessions'
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analysis session statistics retrieved successfully',
  })
  async getStats(@Param('userId') userId: string): Promise<{
    success: boolean;
    data: {
      totalSessions: number;
      completedSessions: number;
      inProgressSessions: number;
      cancelledSessions: number;
      firstSession?: Date;
      lastSession?: Date;
    };
    message: string;
    timestamp: string;
  }> {
    const stats = await this.analysisSessionsService.getSessionStats(userId);
    return {
      success: true,
      data: stats,
      message: 'Analysis session statistics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
