import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order } from '../../services/models/interfaces.model'; // Adjust based on your models
import { CartOrderService } from '../../services/cart-order.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  imports: [CommonModule, RouterLink, FormsModule],
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  searchTerm: string = ''; // For search input
  selectedStatus: string = ''; // For status filter

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.filteredOrders = data; // Initialize with all orders
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.error = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesPhone = order.phoneNumber.includes(this.searchTerm);
      const matchesStatus = this.selectedStatus ? order.status === this.selectedStatus : true;
      return matchesPhone && matchesStatus;
    });
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/admin/orders', orderId]);
  }
}
