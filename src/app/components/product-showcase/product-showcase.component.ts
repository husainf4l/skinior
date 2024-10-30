import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/models/interfaces.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-product-showcase',
  templateUrl: './product-showcase.component.html',
  styleUrls: ['./product-showcase.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent]
})
export class ProductShowcaseComponent implements OnInit {
  @Input() categoryHandle!: string;
  @Input() title: string = 'Products';

  products: Product[] = [];
  loading: boolean = true; // Loading state


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    if (this.categoryHandle) {
      this.loadProducts();
    }
  }



  loadProducts() {
    this.productService.getFeaturedProducts(this.categoryHandle).subscribe(
      (products) => {
        this.products = products;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    );
  }


}
