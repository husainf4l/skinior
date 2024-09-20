import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class CartComponent implements OnInit {
  cart: any = null;
  totalPrice: number = 0;

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      this.cartService.getCart(cartId).subscribe(cart => {
        this.cart = cart;
        this.calculateTotalPrice();
      });
    }
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cart.items.reduce((sum: number, item: any) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }

  incrementQuantity(item: any): void {
    item.quantity++;
    this.cartService.addItemToCart(this.cart.id, item.productId, item.quantity, item.color).subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.addItemToCart(this.cart.id, item.productId, item.quantity, item.color).subscribe(() => {
        this.calculateTotalPrice();
      });
    }
  }

  removeFromCart(itemId: string): void {
    this.cartService.removeItemFromCart(itemId).subscribe(() => {
      this.loadCart(); // Reload the cart after removal
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/shipping-address'], {
      queryParams: {
        cart: JSON.stringify(this.cart.items),  // Pass the cart items
        totalPrice: this.totalPrice              // Pass the total price
      }
    });
  }



}
