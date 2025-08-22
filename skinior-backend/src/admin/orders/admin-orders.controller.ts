import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminGuard } from '../../dashboard/guards/admin.guard';
import { AdminOnly } from '../../dashboard/decorators/admin-only.decorator';
import { AdminOrdersService } from './admin-orders.service';
import { UpdateOrderDto, OrderFilterDto } from '../dto/order.dto';

@ApiTags('Admin - Orders')
@Controller('admin/orders')
@UseGuards(AdminGuard)
@AdminOnly()
@ApiBearerAuth()
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Retrieve all orders with filtering and pagination',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by order number or customer' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'all'] })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: ['pending', 'paid', 'failed', 'cod_pending', 'all'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders retrieved successfully',
  })
  async getAllOrders(@Query() filters: OrderFilterDto) {
    const result = await this.adminOrdersService.getAllOrders(filters);
    return {
      success: true,
      data: result,
      message: 'Orders retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve detailed order information',
  })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order retrieved successfully',
  })
  async getOrderById(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.adminOrdersService.getOrderById(id);
    return {
      success: true,
      data: order,
      message: 'Order retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update order',
    description: 'Update order status and information',
  })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order updated successfully',
  })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    const order = await this.adminOrdersService.updateOrder(id, updateOrderDto);
    return {
      success: true,
      data: order,
      message: 'Order updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('analytics/overview')
  @ApiOperation({
    summary: 'Get orders analytics',
    description: 'Get comprehensive analytics for orders',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics retrieved successfully',
  })
  async getOrdersAnalytics() {
    const analytics = await this.adminOrdersService.getOrdersAnalytics();
    return {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}