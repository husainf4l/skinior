// src/app/components/checkout/checkout.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartOrderService } from '../../services/cart-order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CheckoutComponent {
  phoneNumber: string = '';
  shippingAddress: string = '';
  shippingCity: string = '';
  shippingCountry: string = 'Jordan';

  constructor(
    private router: Router,
    private cartOrderService: CartOrderService
  ) { }

  placeOrder() {
    // Ensure required fields are provided
    if (!this.phoneNumber || !this.shippingAddress || !this.shippingCity) {
      alert('Please fill in all required fields.');
      return;
    }

    // Set the phone number in the service (if needed)
    this.cartOrderService.setPhoneNumber(this.phoneNumber);

    const cartItems = this.cartOrderService.cartItems();
    const totalAmount = this.cartOrderService.totalAmount();

    // Get cartId from localStorage
    const cartIdString = localStorage.getItem('cartId');
    const cartId = cartIdString ? Number(cartIdString) : null;

    if (!cartId) {
      alert('Cart ID is missing. Please add items to your cart.');
      return;
    }

    const order = {
      cartId,
      phoneNumber: this.phoneNumber,
      shippingAddress: this.shippingAddress,
      shippingCity: this.shippingCity,
      shippingCountry: this.shippingCountry,
      totalAmount,
    };

    // Make a request to place the order using the CartOrderService
    this.cartOrderService.placeOrder(order).subscribe({
      next: (response: any) => {
        if (response && response.id) {
          console.log('Order placed successfully:', response);
          this.cartOrderService.clearCart(); // Clear cart after successful order placement
          // Pass the order data to the confirmation page
          this.router.navigate(['/order-confirmation'], {
            state: { order: response },
          });
        } else {
          console.error('Order placement failed or returned invalid response.');
          // Handle the error accordingly, maybe show a message to the user
        }
      },
      error: (error) => {
        console.error('Error placing order:', error);
      },
    });
  }
}
