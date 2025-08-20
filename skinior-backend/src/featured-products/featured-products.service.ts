import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class FeaturedProductsService {
  constructor(private readonly productsService: ProductsService) {}

  async getFeaturedProducts() {
    return this.productsService.getFeaturedProducts();
  }
}
