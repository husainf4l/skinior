import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartOrderService } from '../../services/cart-order.service';
import { items, Product, Variant } from '../../services/models/interfaces.model'; // Ensure Variant interface is imported

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  selectedVariant: items | null = null;
  selectedVariantImage: any = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartOrderService: CartOrderService
  ) { }

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe(data => {
      this.product = data;
    });
  }

  onVariantSelect(items: items): void {
    this.selectedVariant = items;
    this.selectedVariantImage = items.image || this.product?.image || null;
  }

  addToCart(): void {
    if (this.selectedVariant) {
      const itemToAdd = {
        ...this.product,
        variant: this.selectedVariant,
      };
      console.log(itemToAdd)
      this.cartOrderService.addToCart(itemToAdd, 1, this.selectedVariant.id);
    } else {
      this.cartOrderService.addToCart(this.product, 1,);
    }
  }
}
