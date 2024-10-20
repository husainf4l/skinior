import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/models/interfaces.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-showcase',
  templateUrl: './product-showcase.component.html',
  styleUrls: ['./product-showcase.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ProductShowcaseComponent implements OnInit {
  @Input() categoryId!: number; // Dynamic category ID input
  @Input() title: string = 'Products'; // Dynamic title input

  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    if (this.categoryId) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this.productService.getFeaturedProducts(this.categoryId).subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Error loading products', error);
      }
    );
  }
}
