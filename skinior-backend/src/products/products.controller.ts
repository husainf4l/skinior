import { Controller, Get, Param, ParseIntPipe, Query, Post, Put, Delete, Body, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('featured')
  async getFeaturedProducts() {
    return this.productsService.getFeaturedProducts();
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Get('category/:categoryId')
  async getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.getProductsByCategory(categoryId);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post()
  async createProduct(@Body() data: any) {
    return this.productsService.createProduct(data);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() data: any
  ) {
    return this.productsService.updateProduct(id, data);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
