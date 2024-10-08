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
