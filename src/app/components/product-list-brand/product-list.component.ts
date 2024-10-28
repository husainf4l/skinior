import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartOrderService } from '../../services/cart-order.service'; // If needed
import { Category, Product } from '../../services/models/interfaces.model';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-product-list-brand',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list-brand.component.html',
})
export class ProductListBrandComponent implements OnInit {
  products: Product[] = [];
  brand: string = "";
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const brand = params.get('brand');
      if (brand) {
        this.brand = brand;
        this.loadProductsByBrand();
      } else {
        this.handleError('No category selected.');
      }
    });
  }

  private loadProductsByBrand(): void {
    this.productService.getProductsByBRAND(this.brand).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        if (products.length > 0 ) {
          this.updateSeoTags();
        } else {
          this.handleError('No products found in this category.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.handleError('Failed to load products. Please try again later.');
      }
    });
  }

  private updateSeoTags(): void {
    const title = this.brand || 'Default Category Title';
    const description = `Explore products from the ${this.brand || 'brand'}.`;

    this.seoService.updatePageTitle(title);
    this.seoService.updateMetaTags(title, description);
  }

  addToCart(product: Product, quantity: number = 1): void {
  }

  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
  }
}
