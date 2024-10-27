import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Variant, Product } from '../../services/models/interfaces.model';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

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
  selectedVariantImage: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    const productHandle = this.route.snapshot.paramMap.get('handle');
    if (productHandle) {
      this.loadProduct(productHandle);
    } else {
      console.error('Product handle not found!');
    }
  }

  private loadProduct(handle: string): void {
    this.productService.getProductByHandle(handle).subscribe(
      (data) => {
        this.product = data;

        if (this.product?.variants?.length) {
          this.selectedVariant = this.product.variants[0];
        }

        this.selectedVariantImage = this.selectedVariant?.image || this.product?.image || null;

        // Update SEO tags
        this.updateSeoTags();
      },
      (error) => {
        console.error('Error fetching product:', error);
        alert('Product not found!');
      }
    );
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

    const variantId = this.selectedVariant?.id;

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

  private updateSeoTags(): void {
    if (!this.product) return;

    const title = this.product.metaTitle || this.product.name;
    const description =
      this.product.metaDescription ||
      this.product.descriptionAr ||
      this.product.name;
    const keywords = this.product.metaKeywords || 'default, keywords';
    const image = this.product.image || 'default-image-url.jpg';
    const availability = this.product.stock > 0 ? 'In Stock' : 'Out of Stock';
    const discount = this.calculateDiscount();

    this.seoService.updatePageTitle(title);
    this.seoService.updateMetaTags(
      title,
      description,
      keywords,
      image,
      availability,
      discount
    );
  }

  private calculateDiscount(): number {
    if (this.product?.discountedPrice && this.product.price) {
      return ((this.product.price - this.product.discountedPrice) / this.product.price) * 100;
    }
    return 0;
  }
}
