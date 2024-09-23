import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent {
  product!: Product;
  selectedImage!: string;
  selectedVariant: any;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      // Fetch product data by ID
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          if (this.product.images && this.product.images.length > 0) {
            this.selectedImage = this.product.images[0].url;
          }
          // Set the first variant as the default selection
          if (this.product.variants && this.product.variants.length > 0) {
            this.selectedVariant = this.product.variants[0];
          }
        },
        error: (error) => {
          this.errorMessage = 'Product not found.';
          console.error(error);
        },
      });
    } else {
      this.errorMessage = 'Invalid product ID.';
    }
  }

  // Change selected image on thumbnail click
  changeImage(url: string) {
    this.selectedImage = url;
  }

  // Handle variant change when the user selects a different variant
  onVariantChange(variant: any) {
    this.selectedVariant = variant;
    // Update the displayed image with the variant's first image
    if (variant.images && variant.images.length > 0) {
      this.changeImage(variant.images[0].url);
    }
  }
}
