import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/models/interfaces.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  brand: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  q: string = '';
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    // Subscribe to query parameters dynamically
    this.route.queryParamMap.subscribe((params) => {
      this.q = params.get('q') || ''; // Handle the query parameter

      if (this.q) {
        this.loadProductsBySearch();
      } else {
        this.handleError('No query or brand provided.');
      }
    });
  }

  private loadProductsBySearch(): void {
    const searchCriteria = this.q; // Use query or brand as criteria
    this.productService.searchProducts(searchCriteria).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        if (products.length > 0) {
          this.updateSeoTags();
        } else {
          this.handleError('No products found for this search.');
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
    const title = this.q || this.brand || 'Default Search Title';
    const description = `Explore products based on ${this.q || this.brand}.`;

    this.seoService.updatePageTitle(title);
    this.seoService.updateMetaTags(title, description);
  }

  addToCart(product: Product, quantity: number = 1): void {
    // Implement the add to cart logic
    console.log(`Adding ${quantity} of ${product.name} to cart.`);
  }

  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
  }
}
