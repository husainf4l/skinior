import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../services/models/interfaces.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
  standalone:true,
  imports:[CommonModule]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | undefined;
  orderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Retrieve order ID from route parameters or navigation state
    this.orderId = this.route.snapshot.params['orderId'] || 
      history.state?.['orderId'];

    if (this.orderId) {
      this.fetchOrderDetails(this.orderId);
    } else {
      alert('No order ID found. Redirecting to homepage...');
      this.router.navigate(['/']);
    }
  }

  // Fetch the order details from the backend using the order ID
  fetchOrderDetails(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (error) => {
        console.error('Error fetching order:', error);
        alert('Failed to load order details. Redirecting to homepage...');
        this.router.navigate(['/']);
      },
    });
  }

  // Navigate back to the homepage
  goHome(): void {
    this.router.navigate(['/']);
  }
}
