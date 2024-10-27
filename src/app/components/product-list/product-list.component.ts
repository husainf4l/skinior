// src/app/pages/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartOrderService } from '../../services/cart-order.service'; // If needed
import { Category, Product } from '../../services/models/interfaces.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
    private cartOrderService: CartOrderService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('categoryHandle');
      if (idParam) {
        this.categoryHandle = idParam;
        this.loadProductsByCategory();
      } else {
        this.error = 'No category selected.';
        this.isLoading = false;
      }
    });
  }

  loadProductsByCategory(): void {
    this.productService.getProductsByCategoryHandle(this.categoryHandle).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        if (this.products.length > 0) {
          this.category = this.products[0].category;
        }
        this.isLoading = false;

      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';


        this.isLoading = false;
      }
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    // Implement add to cart functionality
    // Example:
    this.cartOrderService.addToCart(product, quantity);
  }
}
