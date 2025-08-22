import { Controller, Get, Put, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardInventoryService } from './dashboard-inventory.service';
import { InventoryFilterDto, UpdateProductDto } from '../dto/dashboard.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminOnly } from '../decorators/admin-only.decorator';

@ApiTags('Dashboard Inventory')
@Controller('dashboard/inventory')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@AdminOnly()
export class DashboardInventoryController {
  constructor(private readonly inventoryService: DashboardInventoryService) {}

  @Get('products')
  @ApiOperation({
    summary: 'Get products with inventory management filters',
    description: 'Returns paginated list of products with inventory details',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  async getProducts(@Query() filters: InventoryFilterDto) {
    const result = await this.inventoryService.getProducts(filters);
    return {
      success: true,
      data: result,
      message: 'Products retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('products/:id')
  @ApiOperation({
    summary: 'Get single product details for inventory management',
    description: 'Returns detailed product information including stock and sales data',
  })
  @ApiResponse({
    status: 200,
    description: 'Product details retrieved successfully',
  })
  async getProduct(@Param('id') id: string) {
    const product = await this.inventoryService.getProduct(id);
    return {
      success: true,
      data: product,
      message: 'Product details retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put('products/:id')
  @ApiOperation({
    summary: 'Update product information',
    description: 'Updates product details including pricing, stock, and metadata',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  async updateProduct(@Param('id') id: string, @Body() updateData: UpdateProductDto) {
    const product = await this.inventoryService.updateProduct(id, updateData);
    return {
      success: true,
      data: product,
      message: 'Product updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('products/:id/stock')
  @ApiOperation({
    summary: 'Update product stock quantity',
    description: 'Updates only the stock quantity for a specific product',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock updated successfully',
  })
  async updateStock(
    @Param('id') id: string,
    @Body() body: { stockQuantity: number }
  ) {
    const product = await this.inventoryService.updateStock(id, body.stockQuantity);
    return {
      success: true,
      data: product,
      message: 'Stock updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('products/bulk-stock')
  @ApiOperation({
    summary: 'Bulk update stock quantities',
    description: 'Updates stock quantities for multiple products at once',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk stock update completed',
  })
  async bulkUpdateStock(
    @Body() body: { updates: Array<{ id: string; stockQuantity: number }> }
  ) {
    const result = await this.inventoryService.bulkUpdateStock(body.updates);
    return {
      success: true,
      data: result,
      message: 'Bulk stock update completed',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('low-stock')
  @ApiOperation({
    summary: 'Get products with low stock',
    description: 'Returns products that are running low on inventory',
  })
  @ApiResponse({
    status: 200,
    description: 'Low stock products retrieved successfully',
  })
  async getLowStockProducts(@Query('threshold') threshold?: string) {
    const thresholdValue = threshold ? parseInt(threshold) : 10;
    const products = await this.inventoryService.getLowStockProducts(thresholdValue);
    return {
      success: true,
      data: products,
      message: 'Low stock products retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Get product categories',
    description: 'Returns all product categories with product counts',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async getCategories() {
    const categories = await this.inventoryService.getCategories();
    return {
      success: true,
      data: categories,
      message: 'Categories retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('brands')
  @ApiOperation({
    summary: 'Get product brands',
    description: 'Returns all product brands with product counts',
  })
  @ApiResponse({
    status: 200,
    description: 'Brands retrieved successfully',
  })
  async getBrands() {
    const brands = await this.inventoryService.getBrands();
    return {
      success: true,
      data: brands,
      message: 'Brands retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get inventory summary',
    description: 'Returns overall inventory statistics and metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory summary retrieved successfully',
  })
  async getInventorySummary() {
    const summary = await this.inventoryService.getInventorySummary();
    return {
      success: true,
      data: summary,
      message: 'Inventory summary retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}