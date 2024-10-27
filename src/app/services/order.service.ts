import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from './models/interfaces.model'; // Adjust path based on your project
import { environment } from '../enviroments/enviroment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    getOrderById(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/order/${orderId}`);
    }

    createOrderFromSession(sessionId: string): Observable<any> {
        const url = `${this.apiUrl}/session/${sessionId}`;
        return this.http.post(url, {});
      }
    


}
