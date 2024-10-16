import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/models/interfaces.model';
import Decimal from 'decimal.js';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: Product[] = [];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => (this.featuredProducts = products),
      error: (err) => console.log('Error Loading products', err)
    })
  }





}
