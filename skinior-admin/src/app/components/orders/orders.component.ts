import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AdminService } from '../../services/admin.service';
import { Order } from '../../interfaces/admin.interface';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="orders-container">
      <div class="orders-header">
        <h1 class="page-title">Orders Management</h1>
        <p class="page-subtitle">Manage and track customer orders</p>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Search orders</mat-label>
              <input matInput [(ngModel)]="searchTerm" placeholder="Order number, customer..." 
                     (keyup.enter)="loadOrders()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Order Status</mat-label>
              <mat-select [(ngModel)]="selectedStatus" (selectionChange)="loadOrders()">
                <mat-option value="">All Status</mat-option>
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="confirmed">Confirmed</mat-option>
                <mat-option value="shipped">Shipped</mat-option>
                <mat-option value="delivered">Delivered</mat-option>
                <mat-option value="cancelled">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Payment Status</mat-label>
              <mat-select [(ngModel)]="selectedPaymentStatus" (selectionChange)="loadOrders()">
                <mat-option value="">All Payment Status</mat-option>
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="paid">Paid</mat-option>
                <mat-option value="failed">Failed</mat-option>
                <mat-option value="cod_pending">COD Pending</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="loadOrders()">
              <mat-icon>refresh</mat-icon>
              Refresh
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading orders...</p>
      </div>

      <!-- Orders Table -->
      <mat-card class="table-card" *ngIf="!loading">
        <mat-card-header>
          <mat-card-title>Orders ({{ totalOrders }})</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container" *ngIf="orders.length > 0">
            <table mat-table [dataSource]="orders" class="orders-table">
              <!-- Order Number Column -->
              <ng-container matColumnDef="orderNumber">
                <th mat-header-cell *matHeaderCellDef>Order Number</th>
                <td mat-cell *matCellDef="let order">
                  <div class="order-number">
                    <span class="order-id">#{{ order.orderNumber || order.id.slice(-8).toUpperCase() }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Customer Column -->
              <ng-container matColumnDef="customer">
                <th mat-header-cell *matHeaderCellDef>Customer</th>
                <td mat-cell *matCellDef="let order">
                  <div class="customer-info">
                    <div class="customer-name">{{ order.customerName || 'N/A' }}</div>
                    <div class="customer-email">{{ order.customerEmail }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let order">
                  <mat-chip [class]="'status-' + order.status">
                    {{ order.status | titlecase }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Payment Status Column -->
              <ng-container matColumnDef="paymentStatus">
                <th mat-header-cell *matHeaderCellDef>Payment</th>
                <td mat-cell *matCellDef="let order">
                  <mat-chip [class]="'payment-' + order.paymentStatus">
                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Total Column -->
              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let order">
                  <span class="order-total">{{ order.total | currency:(order.currency || 'JOD'):' symbol':'1.2-2' }}</span>
                </td>
              </ng-container>

              <!-- Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let order">
                  {{ order.createdAt | date:'short' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let order">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewOrder(order)">
                      <mat-icon>visibility</mat-icon>
                      <span>View Details</span>
                    </button>
                    <button mat-menu-item (click)="updateOrderStatus(order)">
                      <mat-icon>edit</mat-icon>
                      <span>Update Status</span>
                    </button>
                    <mat-divider></mat-divider>
                    <button mat-menu-item (click)="printOrder(order)">
                      <mat-icon>print</mat-icon>
                      <span>Print Order</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- No Orders Message -->
          <div *ngIf="orders.length === 0" class="no-data">
            <mat-icon>receipt_long</mat-icon>
            <h3>No Orders Found</h3>
            <p>There are no orders matching your current filters.</p>
          </div>

          <!-- Pagination -->
          <mat-paginator 
            *ngIf="orders.length > 0"
            [length]="totalOrders"
            [pageSize]="pageSize"
            [pageIndex]="currentPage"
            [pageSizeOptions]="[10, 25, 50, 100]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .orders-header {
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1d1d1f;
    }

    .page-subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .filters-card {
      margin-bottom: 24px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filters-row mat-form-field {
      min-width: 200px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .loading-container p {
      margin-top: 16px;
      font-size: 14px;
    }

    .table-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .table-container {
      overflow-x: auto;
      margin-top: 16px;
    }

    .orders-table {
      width: 100%;
    }

    .order-number {
      font-family: monospace;
      font-weight: 600;
      color: #3b82f6;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .customer-name {
      font-weight: 500;
      color: #1e293b;
    }

    .customer-email {
      font-size: 12px;
      color: #64748b;
    }

    .order-total {
      font-weight: 600;
      color: #1e293b;
    }

    /* Status Chips */
    .status-pending {
      background-color: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-confirmed {
      background-color: #dbeafe !important;
      color: #1e40af !important;
    }

    .status-shipped {
      background-color: #d1fae5 !important;
      color: #065f46 !important;
    }

    .status-delivered {
      background-color: #dcfce7 !important;
      color: #166534 !important;
    }

    .status-cancelled {
      background-color: #fee2e2 !important;
      color: #dc2626 !important;
    }

    /* Payment Status Chips */
    .payment-pending {
      background-color: #fef3c7 !important;
      color: #92400e !important;
    }

    .payment-paid {
      background-color: #dcfce7 !important;
      color: #166534 !important;
    }

    .payment-failed {
      background-color: #fee2e2 !important;
      color: #dc2626 !important;
    }

    .payment-cod_pending {
      background-color: #e0e7ff !important;
      color: #3730a3 !important;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-data h3 {
      margin: 0 0 8px 0;
      color: #374151;
    }

    .no-data p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .filters-row mat-form-field {
        min-width: unset;
        width: 100%;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  totalOrders = 0;
  loading = true;
  
  // Pagination
  currentPage = 0;
  pageSize = 25;
  
  // Filters
  searchTerm = '';
  selectedStatus = '';
  selectedPaymentStatus = '';
  
  displayedColumns = ['orderNumber', 'customer', 'status', 'paymentStatus', 'total', 'createdAt', 'actions'];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.adminService.getOrders(
      this.currentPage + 1,
      this.pageSize,
      this.searchTerm,
      this.selectedStatus,
      this.selectedPaymentStatus
    ).subscribe({
      next: (response) => {
        this.orders = response.data.orders;
        this.totalOrders = response.data.pagination.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
        this.snackBar.open('Failed to load orders', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  getPaymentStatusLabel(status: string): string {
    switch (status) {
      case 'cod_pending': return 'COD Pending';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  viewOrder(order: Order): void {
    console.log('View order:', order);
    this.snackBar.open('Order details view coming soon', 'Close', { duration: 3000 });
  }

  updateOrderStatus(order: Order): void {
    console.log('Update order status:', order);
    this.snackBar.open('Order status update coming soon', 'Close', { duration: 3000 });
  }

  printOrder(order: Order): void {
    console.log('Print order:', order);
    this.snackBar.open('Print functionality coming soon', 'Close', { duration: 3000 });
  }
}