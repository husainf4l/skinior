import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminGuard } from '../../dashboard/guards/admin.guard';
import { AdminOnly } from '../../dashboard/decorators/admin-only.decorator';
import { AdminAnalyticsService } from './admin-analytics.service';

@ApiTags('Admin - Analytics')
@Controller('admin/analytics')
@UseGuards(AdminGuard)
@AdminOnly()
@ApiBearerAuth()
export class AdminAnalyticsController {
  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get dashboard overview',
    description: 'Get comprehensive dashboard analytics overview',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dashboard analytics retrieved successfully',
  })
  async getDashboardOverview() {
    const analytics = await this.adminAnalyticsService.getDashboardOverview();
    return {
      success: true,
      data: analytics,
      message: 'Dashboard analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('revenue')
  @ApiOperation({
    summary: 'Get revenue analytics',
    description: 'Get detailed revenue analytics with date range filtering',
  })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'], description: 'Analytics period' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Revenue analytics retrieved successfully',
  })
  async getRevenueAnalytics(@Query('period') period: string = '30d') {
    const analytics = await this.adminAnalyticsService.getRevenueAnalytics(period);
    return {
      success: true,
      data: analytics,
      message: 'Revenue analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('products/performance')
  @ApiOperation({
    summary: 'Get product performance analytics',
    description: 'Get detailed product performance metrics',
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Number of top products to return' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product performance analytics retrieved successfully',
  })
  async getProductPerformance(@Query('limit') limit: string = '20') {
    const analytics = await this.adminAnalyticsService.getProductPerformance(parseInt(limit));
    return {
      success: true,
      data: analytics,
      message: 'Product performance analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('customers')
  @ApiOperation({
    summary: 'Get customer analytics',
    description: 'Get comprehensive customer behavior analytics',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer analytics retrieved successfully',
  })
  async getCustomerAnalytics() {
    const analytics = await this.adminAnalyticsService.getCustomerAnalytics();
    return {
      success: true,
      data: analytics,
      message: 'Customer analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('inventory')
  @ApiOperation({
    summary: 'Get inventory analytics',
    description: 'Get inventory status and alerts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory analytics retrieved successfully',
  })
  async getInventoryAnalytics() {
    const analytics = await this.adminAnalyticsService.getInventoryAnalytics();
    return {
      success: true,
      data: analytics,
      message: 'Inventory analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}