import { 
  Controller, 
  Get, 
  Param, 
  Query, 
  Post, 
  Put, 
  Delete, 
  Body, 
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseGuards 
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductSearchDto, ProductAvailabilityFiltersDto } from './dto/product-search.dto';
import { SyncSkiniorProductsDto } from './dto/skinior-sync.dto';
import { UpdateProductAvailabilityDto } from './dto/product-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('featured')
  @Public()
  @ApiOperation({ 
    summary: 'Get featured products',
    description: 'Retrieves all featured products'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Featured products retrieved successfully',
  })
  async getFeaturedProducts(): Promise<{
    success: boolean;
    data: any[];
    message: string;
    timestamp: string;
  }> {
    const products = await this.productsService.getFeaturedProducts();
    return {
      success: true,
      data: products,
      message: 'Featured products retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('search/simple')
  @Public()
  @ApiOperation({ 
    summary: 'Simple product search',
    description: 'Simple text search across products'
  })
  @ApiQuery({
    name: 'q',
    description: 'Search query',
    example: 'serum',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Search results retrieved successfully',
  })
  async searchProducts(@Query('q') query: string): Promise<{
    success: boolean;
    data: any[];
    message: string;
    timestamp: string;
  }> {
    const products = await this.productsService.searchProducts(query);
    return {
      success: true,
      data: products,
      message: 'Search results retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('category/:categoryId')
  @Public()
  @ApiOperation({ 
    summary: 'Get products by category',
    description: 'Retrieves products filtered by category'
  })
  @ApiParam({
    name: 'categoryId',
    description: 'Category identifier',
    example: 'cat_123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category products retrieved successfully',
  })
  async getProductsByCategory(@Param('categoryId') categoryId: string): Promise<{
    success: boolean;
    data: any[];
    message: string;
    timestamp: string;
  }> {
    const products = await this.productsService.getProductsByCategory(categoryId);
    return {
      success: true,
      data: products,
      message: 'Category products retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id/details')
  @Public()
  @ApiOperation({ 
    summary: 'Get detailed product information',
    description: 'Retrieves comprehensive product details for Agent16 integration'
  })
  @ApiParam({
    name: 'id',
    description: 'Product identifier',
    example: 'prod_001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product details retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async getProductDetails(@Param('id') id: string): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    const product = await this.productsService.getProductDetails(id);
    return {
      success: true,
      data: product,
      message: 'Product details retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('available')
  @Public()
  @ApiOperation({ 
    summary: 'Get available products with filters',
    description: 'Retrieves available products with skin type, concerns, and budget filters for Agent16'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Available products retrieved successfully',
  })
  async getAvailableProducts(@Query() filters: ProductAvailabilityFiltersDto): Promise<{
    success: boolean;
    data: {
      products: any[];
      total: number;
      filtersApplied: any;
    };
    message: string;
    timestamp: string;
  }> {
    const result = await this.productsService.getAvailableProducts(filters);
    return {
      success: true,
      data: result,
      message: 'Available products retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('search')
  @Public()
  @ApiOperation({ 
    summary: 'Advanced product search',
    description: 'Performs advanced product search with multiple filters and sorting options'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Search results retrieved successfully',
  })
  async searchProductsAdvanced(@Body() searchDto: ProductSearchDto): Promise<{
    success: boolean;
    data: {
      products: any[];
      total: number;
      query: string;
      filtersApplied: any;
    };
    message: string;
    timestamp: string;
  }> {
    const result = await this.productsService.searchProductsAdvanced(searchDto);
    return {
      success: true,
      data: result,
      message: 'Search results retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('sync-skinior')
  @ApiOperation({ 
    summary: 'Sync products from Skinior.com',
    description: 'Syncs product data from Skinior.com for Agent16 recommendations'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Products synced successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to sync products',
  })
  async syncSkiniorProducts(@Body() syncDto: SyncSkiniorProductsDto): Promise<{
    success: boolean;
    data: {
      syncedCount: number;
      updatedCount: number;
      newCount: number;
      errors: string[];
      syncTimestamp: string;
    };
    message: string;
    timestamp: string;
  }> {
    const result = await this.productsService.syncSkiniorProducts(syncDto);
    return {
      success: true,
      data: result,
      message: 'Products synced successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id/availability')
  @ApiOperation({ 
    summary: 'Update product availability',
    description: 'Updates product availability information from external sources'
  })
  @ApiParam({
    name: 'id',
    description: 'Product identifier',
    example: 'prod_001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product availability updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async updateProductAvailability(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductAvailabilityDto,
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    const result = await this.productsService.updateProductAvailability(id, updateDto);
    return {
      success: true,
      data: result,
      message: 'Product availability updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  // Legacy endpoints for backward compatibility
  @Get('legacy/:id')
  @Public()
  @ApiOperation({ 
    summary: 'Get product (legacy)',
    description: 'Legacy endpoint for getting product by ID'
  })
  async getProduct(@Param('id') id: string) {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Get all products (legacy)',
    description: 'Legacy endpoint for getting all products'
  })
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post('legacy')
  @ApiOperation({ 
    summary: 'Create product (legacy)',
    description: 'Legacy endpoint for creating products'
  })
  async createProduct(@Body() data: any) {
    return this.productsService.createProduct(data);
  }

  @Put('legacy/:id')
  @ApiOperation({ 
    summary: 'Update product (legacy)',
    description: 'Legacy endpoint for updating products'
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() data: any
  ) {
    return this.productsService.updateProduct(id, data);
  }

  @Delete('legacy/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete product (legacy)',
    description: 'Legacy endpoint for deleting products'
  })
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteProduct(id);
  }
}
