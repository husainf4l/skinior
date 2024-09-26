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
  imports: [CommonModule, FormsModule]
})
export class CheckoutComponent {
  shippingAddress = {
    name: '',
    address: '',
    city: '',
    postalCode: '',
  };

  paymentMethod = 'CashOnDelivery';

  constructor(private router: Router, private cartOrderService: CartOrderService) { }

  placeOrder() {
    const order = {
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      cartItems: this.cartOrderService.cartItems(),  // Fetch cart items from the service
      totalAmount: this.cartOrderService.totalAmount(), // Fetch total amount
    };

    // Make a request to place the order using the CartOrderService
    this.cartOrderService.placeOrder(order).subscribe({
      next: (response) => {
        console.log('Order placed successfully:', response);
        this.cartOrderService.clearCart();  // Clear cart after successful order placement
        this.router.navigate(['/order-confirmation']);
      },
      error: (error) => {
        console.error('Error placing order:', error);
      },
    });
  }
}
