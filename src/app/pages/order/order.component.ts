import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  imports: [CommonModule],
  standalone: true
})
export class OrderComponent implements OnInit {
  address: string | null = null;
  mobile: string | null = null;
  totalPrice: number = 0;

  constructor(private route: ActivatedRoute, private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.address = params['address'];
      this.mobile = params['mobile'];
      this.totalPrice = params['totalPrice'] || 0;  // You can calculate this if not passed
    });
  }

  confirmOrder(): void {
    const orderId = 'generated-order-id';  // Replace with actual logic to generate or retrieve order ID
    this.orderService.confirmOrder(orderId, this.totalPrice);
  }
}
