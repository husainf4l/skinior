import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Address } from '../../services/models/interfaces.model';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class CheckoutComponent {
  phoneNumber: string = '';
  line1: string = '';
  line2: string = '';
  shippingCity: string = '';
  shippingCountry: string = 'Jordan';
  paymentMethod: string = 'CashOnDelivery'; // Default payment method

  constructor(
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  // Place order flow starts here
  placeOrder() {
    if (!this.validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      alert('Session ID is missing. Please try again.');
      return;
    }

    const address: Address = {
      phoneNumber: this.phoneNumber,
      line1: this.line1,
      line2: this.line2,
      city: this.shippingCity,
      country: this.shippingCountry,
    };

    // Step 1: Add the address to the cart
    this.cartService.addAddress(sessionId, address).subscribe({
      next: () => {
        console.log('Address added to cart successfully.');

        // Step 2: Proceed to place the order
        this.proceedToPlaceOrder(sessionId);
      },
      error: (error) => {
        console.error('Error adding address to cart:', error);
        alert('Failed to add address. Please try again.');
      },
    });
  }

  // Proceed to place the order
  private proceedToPlaceOrder(sessionId: string) {
    this.orderService.createOrderFromSession(sessionId).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.cartService.cartCount.set(0)
        this.cartService.totalAmount.set(0)
        this.cartService.items.set([])
        this.router.navigate([`/order-confirmation/${response.order.id}`], {
          state: { order: response.order },
        });
   
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Failed to place the order. Please try again.');
      },
    });
  }

  // Validate the form fields
  validateForm(): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    const isPhoneValid = this.phoneNumber.match(phoneRegex) !== null;

    return (
      isPhoneValid &&
      this.line1.trim() !== '' &&
      this.shippingCity.trim() !== '' &&
      this.shippingCountry.trim() !== ''
    );
  }
}
