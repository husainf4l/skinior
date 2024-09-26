import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OrderConfirmationComponent implements OnInit {
  order: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Get the order from the router state (check if it exists)
    this.order = history.state?.order;

    // Debug to check if the order is present
    console.log('Order confirmation data:', this.order);

    // If no order was placed, redirect to home
    if (!this.order || !this.order.cartItems?.length) {
      console.log('No order found, redirecting to home.');
      this.router.navigate(['/']);
    }
  }

  goBackToHome(): void {
    this.router.navigate(['/']);
  }
}
