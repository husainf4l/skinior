import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardOrdersService } from './dashboard-orders.service';
import { OrderFilterDto, UpdateOrderStatusDto } from '../dto/dashboard.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminOnly } from '../decorators/admin-only.decorator';

@ApiTags('Dashboard Orders')
@Controller('dashboard/orders')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@AdminOnly()
export class DashboardOrdersController {
  constructor(private readonly ordersService: DashboardOrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get orders with filters',
    description: 'Returns paginated list of orders with customer and item details',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  async getOrders(@Query() filters: OrderFilterDto) {
    const result = await this.ordersService.getOrders(filters);
    return {
      success: true,
      data: result,
      message: 'Orders retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get order statistics',
    description: 'Returns comprehensive order statistics and metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Order statistics retrieved successfully',
  })
  async getOrderStats() {
    const stats = await this.ordersService.getOrderStats();
    return {
      success: true,
      data: stats,
      message: 'Order statistics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('recent')
  @ApiOperation({
    summary: 'Get recent orders',
    description: 'Returns most recent orders for dashboard overview',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent orders retrieved successfully',
  })
  async getRecentOrders(@Query('limit') limit?: string) {
    const limitValue = limit ? parseInt(limit) : 10;
    const orders = await this.ordersService.getRecentOrders(limitValue);
    return {
      success: true,
      data: orders,
      message: 'Recent orders retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('by-status')
  @ApiOperation({
    summary: 'Get orders grouped by status',
    description: 'Returns order counts grouped by status for analytics',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders by status retrieved successfully',
  })
  async getOrdersByStatus() {
    const data = await this.ordersService.getOrdersByStatus();
    return {
      success: true,
      data,
      message: 'Orders by status retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('by-payment-method')
  @ApiOperation({
    summary: 'Get orders grouped by payment method',
    description: 'Returns order counts and revenue grouped by payment method',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders by payment method retrieved successfully',
  })
  async getOrdersByPaymentMethod() {
    const data = await this.ordersService.getOrdersByPaymentMethod();
    return {
      success: true,
      data,
      message: 'Orders by payment method retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('sales-chart')
  @ApiOperation({
    summary: 'Get daily sales chart data',
    description: 'Returns daily sales data for chart visualization',
  })
  @ApiResponse({
    status: 200,
    description: 'Sales chart data retrieved successfully',
  })
  async getSalesChart(@Query('days') days?: string) {
    const daysValue = days ? parseInt(days) : 30;
    const data = await this.ordersService.getDailySalesChart(daysValue);
    return {
      success: true,
      data,
      message: 'Sales chart data retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('pending-actions')
  @ApiOperation({
    summary: 'Get pending actions requiring attention',
    description: 'Returns counts of orders and items requiring action',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending actions retrieved successfully',
  })
  async getPendingActions() {
    const actions = await this.ordersService.getPendingActions();
    return {
      success: true,
      data: actions,
      message: 'Pending actions retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order details',
    description: 'Returns detailed order information with items and customer data',
  })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
  })
  async getOrder(@Param('id') id: string) {
    const order = await this.ordersService.getOrder(id);
    return {
      success: true,
      data: order,
      message: 'Order details retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update order status',
    description: 'Updates order status and triggers related workflows',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateData: UpdateOrderStatusDto
  ) {
    const order = await this.ordersService.updateOrderStatus(id, updateData);
    return {
      success: true,
      data: order,
      message: 'Order status updated successfully',
      timestamp: new Date().toISOString(),
    };
  }
}