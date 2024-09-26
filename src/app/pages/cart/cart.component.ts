import { Component, OnInit, computed } from '@angular/core';
import { CartOrderService } from '../../services/cart-order.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class CartComponent implements OnInit {
  cartItems = computed(() => this.cartOrderService.cartItems());
  totalAmount = computed(() => this.cartOrderService.totalAmount());

  constructor(private cartOrderService: CartOrderService) { }

  ngOnInit(): void {
    // Nothing is needed here as we're directly using the computed signals in the template.
  }

  // Remove an item from the cart
  removeFromCart(productId: number): void {
    this.cartOrderService.removeFromCart(productId);
  }


  // Clear the cart
  clearCart(): void {
    this.cartOrderService.clearCart();
  }


}
