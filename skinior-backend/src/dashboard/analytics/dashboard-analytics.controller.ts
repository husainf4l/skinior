import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardAnalyticsService } from './dashboard-analytics.service';
import { AnalyticsDto } from '../dto/dashboard.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminOnly } from '../decorators/admin-only.decorator';

@ApiTags('Dashboard Analytics')
@Controller('dashboard/analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@AdminOnly()
export class DashboardAnalyticsController {
  constructor(private readonly analyticsService: DashboardAnalyticsService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get dashboard overview statistics',
    description: 'Returns key metrics for the dashboard overview',
  })
  @ApiResponse({
    status: 200,
    description: 'Overview statistics retrieved successfully',
  })
  async getOverview(@Query() dto: AnalyticsDto) {
    const stats = await this.analyticsService.getOverviewStats(dto);
    return {
      success: true,
      data: stats,
      message: 'Overview statistics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('revenue')
  @ApiOperation({
    summary: 'Get revenue analytics',
    description: 'Returns revenue data over time with customizable periods',
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue analytics retrieved successfully',
  })
  async getRevenueAnalytics(@Query() dto: AnalyticsDto) {
    const data = await this.analyticsService.getRevenueChart(dto);
    return {
      success: true,
      data,
      message: 'Revenue analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('products/top')
  @ApiOperation({
    summary: 'Get top performing products',
    description: 'Returns best-selling products by revenue and quantity',
  })
  @ApiResponse({
    status: 200,
    description: 'Top products retrieved successfully',
  })
  async getTopProducts(@Query() dto: AnalyticsDto) {
    const products = await this.analyticsService.getTopProducts(dto);
    return {
      success: true,
      data: products,
      message: 'Top products retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('customers')
  @ApiOperation({
    summary: 'Get customer analytics',
    description: 'Returns customer growth and engagement metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer analytics retrieved successfully',
  })
  async getCustomerAnalytics(@Query() dto: AnalyticsDto) {
    const stats = await this.analyticsService.getCustomerStats(dto);
    return {
      success: true,
      data: stats,
      message: 'Customer analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('orders')
  @ApiOperation({
    summary: 'Get order analytics',
    description: 'Returns order statistics by status and payment method',
  })
  @ApiResponse({
    status: 200,
    description: 'Order analytics retrieved successfully',
  })
  async getOrderAnalytics(@Query() dto: AnalyticsDto) {
    const stats = await this.analyticsService.getOrderStats(dto);
    return {
      success: true,
      data: stats,
      message: 'Order analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('inventory')
  @ApiOperation({
    summary: 'Get inventory analytics',
    description: 'Returns inventory statistics and stock levels',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory analytics retrieved successfully',
  })
  async getInventoryAnalytics() {
    const stats = await this.analyticsService.getInventoryStats();
    return {
      success: true,
      data: stats,
      message: 'Inventory analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}