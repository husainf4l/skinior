import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../services/models/interfaces.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  standalone: true,
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  imports: [CommonModule, FormsModule],
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  notes: string = ''; // Notes input
  statuses = ['PENDING', 'SEEN', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']; // Status options

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(orderId);
    } else {
      this.error = 'Invalid order ID.';
      this.isLoading = false;
    }
  }

  loadOrderDetails(id: string): void {
    this.orderService.getOrderById(id).subscribe({
      next: (data: Order) => {
        this.order = data;
        this.notes = data.notes || '';


        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
        this.error = 'Failed to load order details.';
        this.isLoading = false;
      },
    });
  }




}
