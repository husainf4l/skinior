import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  imports: [CommonModule],
  standalone: true
})
export class OrderDetailsComponent implements OnInit {
  orderId: string | null = null;
  address: string | null = null;
  mobile: string | null = null;
  totalPrice: number = 0;
  orderItems: any[] = [];

  constructor(private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.loadOrderDetails(this.orderId);
    });
  }

  loadOrderDetails(orderId: string | null): void {
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe(order => {
        this.address = order.shippingInfo.address;
        this.mobile = order.shippingInfo.mobile;
        this.totalPrice = order.total;
        this.orderItems = order.items;
      });
    }
  }
}
