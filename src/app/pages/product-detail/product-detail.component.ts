import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: any = {};
  selectedColor: string | null = null;
  showColorWarning = false;
  cartId: string = 'your-cart-id';



  constructor(private activatedRoute: ActivatedRoute, public productService: ProductService, private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartId = localStorage.getItem('cartId') || this.initializeCart();

    this.activatedRoute.params.subscribe(
      url => {
        console.log('url', url['id'])
        this.productService.getProductDetailById(url['id']).subscribe(
          data => {
            console.log('data', data)
            this.product = data
          }
        )

      }
    )
  }
  initializeCart(): string {
    this.cartService.createCart().subscribe(cart => {
      localStorage.setItem('cartId', cart.id);
      this.cartId = cart.id;
    });
    return this.cartId;
  }

  addToCart() {
    if (!this.selectedColor) {
      this.showColorWarning = true;
    } else {
      this.showColorWarning = false;
      this.cartService.addItemToCart(this.cartId, this.product.id, 1, this.selectedColor).subscribe(() => {
        // After adding to cart, update the cart item count
        this.cartService.getCart(this.cartId).subscribe(cart => {
          const totalItems = cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
          this.cartService.updateCartItemCount(totalItems);
        });
      });
    }
  }






}
