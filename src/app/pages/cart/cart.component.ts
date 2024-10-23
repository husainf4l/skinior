import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductDetailsComponent } from "../../components/product-details/product-details.component";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, ProductDetailsComponent],
})
export class CartComponent {
  cartCount = computed(() => this.cartService.cartCount()); // Correctly accessing items
  cartItems = computed(() => this.cartService.items()); // Correctly accessing items
  totalAmount = computed(() => this.cartService.totalAmount());
  sessionId = localStorage.getItem('sessionId') || '';

  constructor(private cartService: CartService) { }

  removeFromCart(productId: number): void {
    this.cartService.deleteItem(productId, this.sessionId).subscribe(() => {
      console.log('Item removed, refreshing cart...');
    });
  }

  incrementQuantity(itemId: number, quantity: number): void {
    this.cartService.updateItemQuantity(itemId, quantity + 1, this.sessionId).subscribe(() => {
      console.log('Quantity incremented');
    });
  }

  decrementQuantity(itemId: number, quantity: number): void {
    if (quantity > 1) {
      this.cartService.updateItemQuantity(itemId, quantity - 1, this.sessionId).subscribe(() => {
        console.log('Quantity decremented');
      });
    }
  }

  clearCart(): void {
    this.cartService.clearCart(this.sessionId);
  }
}
