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

  @Get('deals/today')
  @Public()
  @ApiOperation({
    summary: "Get today's deals",
    description: "Retrieves products that are currently on deal (discounted)"
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of deals to return',
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Pagination offset',
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Today's deals retrieved successfully",
  })
  async getTodaysDeals(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<{
    success: boolean;
    data: any[];
    message: string;
    timestamp: string;
  }> {
    const l = Number(limit) || 20;
    const o = Number(offset) || 0;
    const products = await this.productsService.getTodayDeals(l, o);
    return {
      success: true,
      data: products,
      message: "Today's deals retrieved successfully",
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

  @Get(':id')
  @Public()
  @ApiOperation({ 
    summary: 'Get product by ID',
    description: 'Retrieves a single product by its ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Product identifier',
    example: '684ca6c6-fe72-45e0-9625-47341ed67893',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async getProductById(@Param('id') id: string): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return {
      success: true,
      data: product,
      message: 'Product retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Get products with pagination, filters, and search',
    description: 'Retrieves products with comprehensive pagination, filtering, and search capabilities'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of products per page',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query for product title, description, or ingredients',
    example: 'vitamin c serum',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category ID or slug',
    example: 'serums',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    description: 'Filter by brand ID or slug',
    example: 'the-ordinary',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Minimum price filter',
    example: 10.00,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price filter',
    example: 100.00,
  })
  @ApiQuery({
    name: 'skinType',
    required: false,
    description: 'Filter by skin type',
    example: 'oily',
  })
  @ApiQuery({
    name: 'concerns',
    required: false,
    description: 'Filter by skin concerns (comma-separated)',
    example: 'acne,dark-spots',
  })
  @ApiQuery({
    name: 'isFeatured',
    required: false,
    description: 'Filter featured products only',
    example: true,
  })
  @ApiQuery({
    name: 'isNew',
    required: false,
    description: 'Filter new products only',
    example: true,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter active products only (default: true)',
    example: true,
  })
  @ApiQuery({
    name: 'onSale',
    required: false,
    description: 'Filter products on sale (with compareAtPrice)',
    example: true,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort field (price, createdAt, title, rating)',
    example: 'price',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc, desc)',
    example: 'asc',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully with pagination info',
  })
  async getAllProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('skinType') skinType?: string,
    @Query('concerns') concerns?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('isNew') isNew?: string,
    @Query('isActive') isActive?: string,
    @Query('onSale') onSale?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ): Promise<{
    success: boolean;
    data: {
      products: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
      filters: any;
    };
    message: string;
    timestamp: string;
  }> {
    const filters = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      category,
      brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      skinType,
      concerns: concerns ? concerns.split(',').map(c => c.trim()) : undefined,
      isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      isNew: isNew === 'true' ? true : isNew === 'false' ? false : undefined,
      isActive: isActive === 'false' ? false : true, // default to true
      onSale: onSale === 'true' ? true : onSale === 'false' ? false : undefined,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
    };

    const result = await this.productsService.getAllProductsWithFilters(filters);
    
    return {
      success: true,
      data: result,
      message: 'Products retrieved successfully',
      timestamp: new Date().toISOString(),
    };
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

  @Post()
  @ApiOperation({
    summary: 'Create product',
    description: 'Creates a new product'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid product data',
  })
  async createNewProduct(@Body() data: any): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    const product = await this.productsService.createProduct(data);
    return {
      success: true,
      data: product,
      message: 'Product created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Updates a product by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Product identifier',
    example: '684ca6c6-fe72-45e0-9625-47341ed67893',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async updateProductById(
    @Param('id') id: string,
    @Body() data: any
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    const product = await this.productsService.updateProduct(id, data);
    return {
      success: true,
      data: product,
      message: 'Product updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete product',
    description: 'Deletes a product by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Product identifier',
    example: '684ca6c6-fe72-45e0-9625-47341ed67893',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Product deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  async removeProduct(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteProduct(id);
  }
}
