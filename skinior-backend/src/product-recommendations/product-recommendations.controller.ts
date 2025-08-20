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
import { ProductRecommendationsService } from './product-recommendations.service';
import { CreateProductRecommendationsDto } from './dto/create-product-recommendation.dto';
import { UpdateProductRecommendationDto } from './dto/update-product-recommendation.dto';
import { 
  ProductRecommendationResponseDto, 
  ProductRecommendationsListResponseDto, 
  RecommendationAnalyticsResponseDto 
} from './dto/product-recommendation-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Product Recommendations')
@Controller('product-recommendations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductRecommendationsController {
  constructor(
    private readonly productRecommendationsService: ProductRecommendationsService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create product recommendations',
    description: 'Creates multiple product recommendations based on skin analysis'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product recommendations created successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Analysis session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or user mismatch',
  })
  async create(@Body() createDto: CreateProductRecommendationsDto): Promise<{
    success: boolean;
    data: {
      createdCount: number;
      recommendations: ProductRecommendationResponseDto[];
    };
    message: string;
    timestamp: string;
  }> {
    const result = await this.productRecommendationsService.create(createDto);
    return {
      success: true,
      data: result,
      message: 'Product recommendations created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get product recommendation by ID',
    description: 'Retrieves a specific product recommendation by its ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Product recommendation ID',
    example: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product recommendation retrieved successfully',
    type: ProductRecommendationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product recommendation not found',
  })
  async findOne(@Param('id') id: string): Promise<{
    success: boolean;
    data: ProductRecommendationResponseDto;
    message: string;
    timestamp: string;
  }> {
    const recommendation = await this.productRecommendationsService.findById(id);
    return {
      success: true,
      data: recommendation,
      message: 'Product recommendation retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('users/:userId')
  @ApiOperation({ 
    summary: 'Get user product recommendations',
    description: 'Retrieves product recommendations for a specific user with filtering and pagination'
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user123',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of recommendations to return',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Number of recommendations to skip',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter by recommendation status',
    example: 'pending',
    enum: ['pending', 'purchased', 'tried', 'not_interested', 'wishlist'],
    required: false,
  })
  @ApiQuery({
    name: 'priority',
    description: 'Filter by recommendation priority',
    example: 'high',
    enum: ['high', 'medium', 'low'],
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product recommendations retrieved successfully',
    type: ProductRecommendationsListResponseDto,
  })
  async findByUser(
    @Param('userId') userId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ): Promise<{
    success: boolean;
    data: ProductRecommendationsListResponseDto;
    message: string;
    timestamp: string;
  }> {
    const result = await this.productRecommendationsService.findByUserId(
      userId,
      parseInt(limit, 10),
      parseInt(offset, 10),
      status,
      priority,
    );

    return {
      success: true,
      data: result,
      message: 'Product recommendations retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('analysis/:analysisId')
  @ApiOperation({ 
    summary: 'Get recommendations by analysis session',
    description: 'Retrieves all product recommendations for a specific analysis session'
  })
  @ApiParam({
    name: 'analysisId',
    description: 'Analysis session ID',
    example: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analysis recommendations retrieved successfully',
  })
  async findByAnalysis(@Param('analysisId') analysisId: string): Promise<{
    success: boolean;
    data: ProductRecommendationResponseDto[];
    message: string;
    timestamp: string;
  }> {
    const recommendations = await this.productRecommendationsService.findByAnalysisId(analysisId);
    return {
      success: true,
      data: recommendations,
      message: 'Analysis recommendations retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update product recommendation',
    description: 'Updates a product recommendation status and user notes'
  })
  @ApiParam({
    name: 'id',
    description: 'Product recommendation ID',
    example: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product recommendation updated successfully',
    type: ProductRecommendationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product recommendation not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductRecommendationDto,
  ): Promise<{
    success: boolean;
    data: ProductRecommendationResponseDto;
    message: string;
    timestamp: string;
  }> {
    const recommendation = await this.productRecommendationsService.update(id, updateDto);
    return {
      success: true,
      data: recommendation,
      message: 'Product recommendation updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete product recommendation',
    description: 'Deletes a specific product recommendation'
  })
  @ApiParam({
    name: 'id',
    description: 'Product recommendation ID',
    example: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product recommendation deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product recommendation not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.productRecommendationsService.delete(id);
  }

  @Get('users/:userId/analytics')
  @ApiOperation({ 
    summary: 'Get recommendation analytics',
    description: 'Retrieves comprehensive analytics for user product recommendations'
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recommendation analytics retrieved successfully',
    type: RecommendationAnalyticsResponseDto,
  })
  async getAnalytics(@Param('userId') userId: string): Promise<{
    success: boolean;
    data: RecommendationAnalyticsResponseDto;
    message: string;
    timestamp: string;
  }> {
    const analytics = await this.productRecommendationsService.getRecommendationAnalytics(userId);
    return {
      success: true,
      data: analytics,
      message: 'Recommendation analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('products/:productId/recommendations')
  @ApiOperation({ 
    summary: 'Get recommendations by product',
    description: 'Retrieves all recommendations for a specific product with statistics'
  })
  @ApiParam({
    name: 'productId',
    description: 'Product identifier',
    example: 'prod_001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product recommendations retrieved successfully',
  })
  async getRecommendationsByProduct(@Param('productId') productId: string): Promise<{
    success: boolean;
    data: {
      recommendations: ProductRecommendationResponseDto[];
      totalUsers: number;
      averageRating: number;
      statusBreakdown: Record<string, number>;
    };
    message: string;
    timestamp: string;
  }> {
    const result = await this.productRecommendationsService.getRecommendationsByProduct(productId);
    return {
      success: true,
      data: result,
      message: 'Product recommendations retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
