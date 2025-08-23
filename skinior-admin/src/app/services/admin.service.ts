import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, AdminUser, Order, Product } from '../interfaces/admin.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:4008/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Dashboard Analytics
  getDashboardStats(): Observable<{success: boolean; data: DashboardStats; message: string; timestamp: string}> {
    return this.http.get<{success: boolean; data: DashboardStats; message: string; timestamp: string}>(`${this.apiUrl}/admin/analytics/dashboard`, {
      headers: this.getHeaders()
    });
  }

  // User Management
  getUsers(page = 1, limit = 20, search = '', role = ''): Observable<{
    success: boolean;
    data: {
      users: AdminUser[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
    message: string;
    timestamp: string;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(role && { role })
    });

    return this.http.get<{
      success: boolean;
      data: {
        users: AdminUser[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      };
      message: string;
      timestamp: string;
    }>(`${this.apiUrl}/admin/users?${params}`, {
      headers: this.getHeaders()
    });
  }

  updateUser(userId: string, userData: Partial<AdminUser>): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/admin/users/${userId}`, userData, {
      headers: this.getHeaders()
    });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${userId}`, {
      headers: this.getHeaders()
    });
  }

  // Order Management
  getOrders(page = 1, limit = 20, search = '', status = '', paymentStatus = ''): Observable<{
    success: boolean;
    data: {
      orders: Order[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
    message: string;
    timestamp: string;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus })
    });

    return this.http.get<{
      success: boolean;
      data: {
        orders: Order[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      };
      message: string;
      timestamp: string;
    }>(`${this.apiUrl}/admin/orders?${params}`, {
      headers: this.getHeaders()
    });
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/admin/orders/${orderId}`, { status }, {
      headers: this.getHeaders()
    });
  }

  // Product Management
  getProducts(page = 1, limit = 20, search = '', categoryId = ''): Observable<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(categoryId && { categoryId })
    });

    return this.http.get<{
      products: Product[];
      total: number;
      page: number;
      limit: number;
    }>(`${this.apiUrl}/admin/products?${params}`, {
      headers: this.getHeaders()
    });
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/products`, productData, {
      headers: this.getHeaders()
    });
  }

  updateProduct(productId: string, productData: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/products/${productId}`, productData, {
      headers: this.getHeaders()
    });
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/products/${productId}`, {
      headers: this.getHeaders()
    });
  }
}