import {
  Controller,
  Get,
  Post,
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
import { AnalysisDataService } from './analysis-data.service';
import { CreateAnalysisDataDto } from './dto/create-analysis-data.dto';
import { 
  AnalysisDataResponseDto, 
  AnalysisHistoryResponseDto, 
  ProgressSummaryResponseDto 
} from './dto/analysis-data-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analysis Data')
@Controller('analysis-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalysisDataController {
  constructor(private readonly analysisDataService: AnalysisDataService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Save analysis data',
    description: 'Saves analysis data from Agent16 skin analysis'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Analysis data saved successfully',
    type: AnalysisDataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Analysis session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or user mismatch',
  })
  async create(@Body() createDto: CreateAnalysisDataDto): Promise<{
    success: boolean;
    data: AnalysisDataResponseDto;
    message: string;
    timestamp: string;
  }> {
    const analysisData = await this.analysisDataService.create(createDto);
    return {
      success: true,
      data: analysisData,
      message: 'Analysis data saved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get analysis data by ID',
    description: 'Retrieves specific analysis data by its ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Analysis data ID',
    example: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analysis data retrieved successfully',
    type: AnalysisDataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Analysis data not found',
  })
  async findOne(@Param('id') id: string): Promise<{
    success: boolean;
    data: AnalysisDataResponseDto;
    message: string;
    timestamp: string;
  }> {
    const analysisData = await this.analysisDataService.findById(id);
    return {
      success: true,
      data: analysisData,
      message: 'Analysis data retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('users/:userId/analysis-history')
  @ApiOperation({ 
    summary: 'Get user analysis history',
    description: 'Retrieves analysis history for a specific user with pagination and filtering'
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user123',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of records to return',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Number of records to skip',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'analysisType',
    description: 'Filter by analysis type',
    example: 'skin_analysis',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analysis history retrieved successfully',
    type: AnalysisHistoryResponseDto,
  })
  async getUserHistory(
    @Param('userId') userId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Query('analysisType') analysisType?: string,
  ): Promise<{
    success: boolean;
    data: AnalysisHistoryResponseDto;
    message: string;
    timestamp: string;
  }> {
    const history = await this.analysisDataService.getUserAnalysisHistory(
      userId,
      parseInt(limit, 10),
      parseInt(offset, 10),
      analysisType,
    );

    return {
      success: true,
      data: history,
      message: 'Analysis history retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('sessions/:analysisId/data')
  @ApiOperation({ 
    summary: 'Get analysis data for session',
    description: 'Retrieves all analysis data for a specific analysis session'
  })
  @ApiParam({
    name: 'analysisId',
    description: 'Analysis session ID',
    example: 'uuid',
  })
  @ApiQuery({
    name: 'analysisType',
    description: 'Filter by analysis type',
    example: 'skin_analysis',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session analysis data retrieved successfully',
  })
  async getSessionData(
    @Param('analysisId') analysisId: string,
    @Query('analysisType') analysisType?: string,
  ): Promise<{
    success: boolean;
    data: AnalysisDataResponseDto[];
    message: string;
    timestamp: string;
  }> {
    const data = await this.analysisDataService.getSessionAnalysisData(analysisId, analysisType);
    return {
      success: true,
      data,
      message: 'Session analysis data retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('users/:userId/progress-summary')
  @ApiOperation({ 
    summary: 'Get user progress summary',
    description: 'Retrieves comprehensive progress summary for a user including improvements and timeline'
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Progress summary retrieved successfully',
    type: ProgressSummaryResponseDto,
  })
  async getProgressSummary(@Param('userId') userId: string): Promise<{
    success: boolean;
    data: ProgressSummaryResponseDto;
    message: string;
    timestamp: string;
  }> {
    const summary = await this.analysisDataService.getUserProgressSummary(userId);
    return {
      success: true,
      data: summary,
      message: 'Progress summary retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('analysis-types')
  @ApiOperation({ 
    summary: 'Get analysis types statistics',
    description: 'Retrieves statistics about different analysis types performed'
  })
  @ApiQuery({
    name: 'userId',
    description: 'Filter by user ID',
    example: 'user123',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analysis types statistics retrieved successfully',
  })
  async getAnalysisTypes(@Query('userId') userId?: string): Promise<{
    success: boolean;
    data: { analysisType: string; count: number }[];
    message: string;
    timestamp: string;
  }> {
    const types = await this.analysisDataService.getAnalysisTypes(userId);
    return {
      success: true,
      data: types,
      message: 'Analysis types statistics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete analysis data',
    description: 'Deletes specific analysis data record'
  })
  @ApiParam({
    name: 'id',
    description: 'Analysis data ID',
    example: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Analysis data deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Analysis data not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.analysisDataService.deleteAnalysisData(id);
  }
}
