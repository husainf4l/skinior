import { Controller, Get } from '@nestjs/common';
import { FeaturedProductsService } from './featured-products.service';

@Controller()
export class FeaturedProductsController {
  constructor(private readonly featuredProductsService: FeaturedProductsService) {}

  @Get('featured-products')
  async getFeaturedProducts() {
    return this.featuredProductsService.getFeaturedProducts();
  }
}
