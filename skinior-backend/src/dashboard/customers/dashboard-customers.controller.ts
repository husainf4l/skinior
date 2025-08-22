import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardCustomersService } from './dashboard-customers.service';
import { CustomerFilterDto } from '../dto/dashboard.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminOnly } from '../decorators/admin-only.decorator';

@ApiTags('Dashboard Customers')
@Controller('dashboard/customers')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@AdminOnly()
export class DashboardCustomersController {
  constructor(private readonly customersService: DashboardCustomersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get customers with filters',
    description: 'Returns paginated list of customers with order statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
  })
  async getCustomers(@Query() filters: CustomerFilterDto) {
    const result = await this.customersService.getCustomers(filters);
    return {
      success: true,
      data: result,
      message: 'Customers retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('segments')
  @ApiOperation({
    summary: 'Get customer segments',
    description: 'Returns customer segmentation analytics',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer segments retrieved successfully',
  })
  async getCustomerSegments() {
    const segments = await this.customersService.getCustomerSegments();
    return {
      success: true,
      data: segments,
      message: 'Customer segments retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('top')
  @ApiOperation({
    summary: 'Get top customers by spending',
    description: 'Returns customers with highest lifetime value',
  })
  @ApiResponse({
    status: 200,
    description: 'Top customers retrieved successfully',
  })
  async getTopCustomers(@Query('limit') limit?: string) {
    const limitValue = limit ? parseInt(limit) : 10;
    const customers = await this.customersService.getTopCustomers(limitValue);
    return {
      success: true,
      data: customers,
      message: 'Top customers retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get customer details',
    description: 'Returns detailed customer information with order history and analytics',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer details retrieved successfully',
  })
  async getCustomer(@Param('id') id: string) {
    const customer = await this.customersService.getCustomer(id);
    return {
      success: true,
      data: customer,
      message: 'Customer details retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update customer status',
    description: 'Activates or deactivates a customer account',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer status updated successfully',
  })
  async updateCustomerStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean }
  ) {
    const customer = await this.customersService.updateCustomerStatus(id, body.isActive);
    return {
      success: true,
      data: customer,
      message: 'Customer status updated successfully',
      timestamp: new Date().toISOString(),
    };
  }
}