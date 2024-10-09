// src/app/pages/product-list/product-list.component.ts

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../services/models/category.model'; // Correct import
import { Product } from '../../services/models/product.model'; // Ensure Product is imported if used
import { CartOrderService } from '../../services/cart-order.service'; // If needed

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categoryId: number = 0;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartOrderService: CartOrderService

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('categoryId');
      if (idParam) {
        this.categoryId = +idParam;
        this.loadProductsByCategory();
      } else {
        this.error = 'No category selected.';
        this.isLoading = false;
      }
    });
  }

  loadProductsByCategory(): void {
    this.productService.getProductsByCategoryId(this.categoryId).subscribe({
      next: (data: Product[]) => {
        this.products = data;
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
