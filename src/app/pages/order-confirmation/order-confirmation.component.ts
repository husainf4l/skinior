import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../services/models/interfaces.model';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.order = history.state?.order;

    console.log('Order confirmation data:', this.order);

    if (!this.order || !this.order.orderItems?.length) {
      console.log('No order found, redirecting to home.');
      // this.router.navigate(['/']);
    }
  }

  goBackToHome(): void {
    this.router.navigate(['/']);
  }
}
