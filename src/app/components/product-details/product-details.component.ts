import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Variant, Product } from '../../services/models/interfaces.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  selectedVariant: Variant | null = null;
  quantity: number = 1;
  selectedVariantImage: any = null;


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe((data) => {
      this.product = data;

      // Use optional chaining to safely access variants
      if (this.product?.variants?.length) {
        this.selectedVariant = this.product.variants[0];
      }
    });
  }

  selectVariant(variant: Variant): void {
    this.selectedVariant = variant;
    this.selectedVariantImage = variant.image || this.product?.image || null;

  }

  addToCart(): void {
    if (!this.product) {
      alert('Product not found.');
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      console.error('Session ID not found!');
      return;
    }

    const variantId = this.selectedVariant ? this.selectedVariant.id : undefined;

    this.cartService
      .addItemToCart({
        sessionsId: sessionId,
        productId: this.product.id,
        variantId: variantId,
        quantity: this.quantity,
        isAdd: true,
      })
      .subscribe(
        () => {
          alert('Product added to cart successfully!');
        },
        (error) => {
          console.error('Error adding product to cart:', error);
        }
      );
  }

}
