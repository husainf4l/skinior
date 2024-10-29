import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartOrderService } from '../../services/cart-order.service'; // If needed
import { Category, Product } from '../../services/models/interfaces.model';
import { SeoService } from '../../services/seo.service';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categoryHandle: string = "";
  isLoading: boolean = true;
  error: string | null = null;
  category: Category | undefined;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartOrderService: CartOrderService,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const handle = params.get('categoryHandle');
      if (handle) {
        this.categoryHandle = handle;
        this.loadProductsByCategory();
      } else {
        this.handleError('No category selected.');
      }
    });
  }

  private loadProductsByCategory(): void {
    this.productService.getProductsByCategoryHandle(this.categoryHandle).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        if (products.length > 0 && products[0].category) {
          this.category = products[0].category;
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
    const title = this.category?.name || 'Default Category Title';
    const description = `Explore products from the ${this.category?.name || 'category'}.`;

    this.seoService.updatePageTitle(title);
    this.seoService.updateMetaTags(title, description);
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartOrderService.addToCart(product, quantity);
  }

  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
  }
}
