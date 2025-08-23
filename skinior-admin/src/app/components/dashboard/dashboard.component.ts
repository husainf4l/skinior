import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../services/admin.service';
import { DashboardStats } from '../../interfaces/admin.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening with your business.</p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && stats" class="dashboard-content">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card users-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>people</mat-icon>
                </div>
                <div class="stat-details">
                  <h3 class="stat-number">{{ stats.summary.users.total | number }}</h3>
                  <p class="stat-label">Total Users</p>
                  <p class="stat-subtitle">{{ stats.summary.users.active }} active</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card products-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>inventory_2</mat-icon>
                </div>
                <div class="stat-details">
                  <h3 class="stat-number">{{ stats.summary.products.total | number }}</h3>
                  <p class="stat-label">Products</p>
                  <p class="stat-subtitle">{{ stats.summary.products.active }} active</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card orders-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>receipt_long</mat-icon>
                </div>
                <div class="stat-details">
                  <h3 class="stat-number">{{ stats.summary.orders.total | number }}</h3>
                  <p class="stat-label">Total Orders</p>
                  <p class="stat-subtitle">{{ stats.summary.orders.pending }} pending</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card revenue-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>attach_money</mat-icon>
                </div>
                <div class="stat-details">
                  <h3 class="stat-number">{{ stats.summary.revenue.total | currency:'JOD':' symbol':'1.2-2' }}</h3>
                  <p class="stat-label">Total Revenue</p>
                  <p class="stat-subtitle">{{ stats.summary.revenue.monthly | currency:'JOD':' symbol':'1.2-2' }} this month</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Recent Orders -->
        <div class="dashboard-section">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Recent Orders</mat-card-title>
              <div class="card-actions">
                <button mat-button color="primary" (click)="navigateToOrders()">
                  View All Orders
                </button>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="stats?.recentActivity?.orders && stats.recentActivity.orders.length > 0" class="table-container">
                <table mat-table [dataSource]="stats.recentActivity.orders" class="orders-table">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>Order ID</th>
                    <td mat-cell *matCellDef="let order">
                      <span class="order-id">#{{ order.id.slice(-8).toUpperCase() }}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="customer">
                    <th mat-header-cell *matHeaderCellDef>Customer</th>
                    <td mat-cell *matCellDef="let order">
                      <div class="customer-info">
                        <span class="customer-name">{{ order.user?.firstName }} {{ order.user?.lastName }}</span>
                        <span class="customer-email">{{ order.user?.email }}</span>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let order">
                      <mat-chip [class]="'status-' + order.status">
                        {{ order.status | titlecase }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="total">
                    <th mat-header-cell *matHeaderCellDef>Total</th>
                    <td mat-cell *matCellDef="let order">
                      <span class="order-total">{{ order.total | currency:order.currency:' symbol':'1.2-2' }}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let order">
                      {{ order.createdAt | date:'short' }}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['id', 'customer', 'status', 'total', 'date']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['id', 'customer', 'status', 'total', 'date']"></tr>
                </table>
              </div>
              <div *ngIf="!stats?.recentActivity?.orders?.length" class="no-data">
                <mat-icon>receipt_long</mat-icon>
                <p>No recent orders</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Recent Products -->
        <div class="dashboard-section">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Recent Products</mat-card-title>
              <div class="card-actions">
                <button mat-button color="primary" (click)="navigateToProducts()">
                  View All Products
                </button>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="stats?.recentActivity?.products && stats.recentActivity.products.length > 0" class="products-grid">
                <div *ngFor="let product of stats.recentActivity.products" class="product-card">
                  <div class="product-image">
                    <img [src]="(product.images && product.images[0]) ? product.images[0].url : '/assets/images/no-image.svg'" 
                         [alt]="product.title">
                  </div>
                  <div class="product-info">
                    <h4 class="product-title">{{ product.title }}</h4>
                    <p class="product-sku">SKU: {{ product.sku }}</p>
                    <div class="product-price">
                      <span class="current-price">{{ product.price | currency:product.currency:' symbol':'1.2-2' }}</span>
                      <span *ngIf="product.compareAtPrice" class="compare-price">
                        {{ product.compareAtPrice | currency:product.currency:' symbol':'1.2-2' }}
                      </span>
                    </div>
                    <div class="product-stock">
                      <span [class]="product.stockQuantity > 10 ? 'in-stock' : product.stockQuantity > 0 ? 'low-stock' : 'out-of-stock'">
                        {{ product.stockQuantity }} in stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div *ngIf="!stats?.recentActivity?.products?.length" class="no-data">
                <mat-icon>inventory_2</mat-icon>
                <p>No products data available</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1e293b;
    }

    .page-subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .users-card .stat-icon {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .products-card .stat-icon {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .orders-card .stat-icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .revenue-card .stat-icon {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
    }

    .stat-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #1e293b;
    }

    .stat-label {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }

    .stat-subtitle {
      font-size: 12px;
      color: #94a3b8;
      margin: 2px 0 0 0;
      font-weight: 400;
    }

    .dashboard-section {
      margin-bottom: 32px;
    }

    .card-actions {
      margin-left: auto;
    }

    .table-container {
      overflow-x: auto;
      margin-top: 16px;
    }

    .orders-table {
      width: 100%;
    }

    .order-id {
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

    .status-pending {
      background-color: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-processing {
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

    .order-total {
      font-weight: 600;
      color: #1e293b;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
      margin-top: 16px;
    }

    .product-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .product-image {
      height: 160px;
      overflow: hidden;
      background: #f8fafc;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info {
      padding: 16px;
    }

    .product-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #1e293b;
    }

    .product-sku {
      font-size: 12px;
      color: #64748b;
      margin: 0 0 8px 0;
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .current-price {
      font-weight: 600;
      color: #1e293b;
    }

    .compare-price {
      font-size: 12px;
      text-decoration: line-through;
      color: #64748b;
    }

    .in-stock {
      color: #059669;
      font-size: 12px;
      font-weight: 500;
    }

    .low-stock {
      color: #d97706;
      font-size: 12px;
      font-weight: 500;
    }

    .out-of-stock {
      color: #dc2626;
      font-size: 12px;
      font-weight: 500;
    }

    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: #64748b;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load dashboard stats:', error);
        this.loading = false;
        // Create mock data for demo purposes
        this.stats = {
          summary: {
            products: { total: 4, active: 4, lowStock: 0 },
            orders: { total: 0, pending: 0, today: 0 },
            revenue: { total: 0, monthly: 0, today: 0 },
            users: { total: 3, active: 3, newThisMonth: 3 },
            catalog: { categories: 2, brands: 3 }
          },
          recentActivity: {
            orders: [],
            products: []
          }
        };
      }
    });
  }

  navigateToOrders(): void {
    this.router.navigate(['/orders']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}