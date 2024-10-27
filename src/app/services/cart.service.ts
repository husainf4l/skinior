import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, switchMap } from 'rxjs';
import { Address, Cart, CartItem } from './models/interfaces.model';
import { environment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = `${environment.apiUrl}/cart`;

  // Signals to manage cart state
  readonly cartCount = signal<number>(0);
  readonly totalAmount = signal<number>(0);
  readonly items = signal<CartItem[]>([]);

  constructor(private http: HttpClient) { }

  // Centralized state update
  private updateCartState(cart: Cart): void {
    this.cartCount.set(cart.totalQuantity || 0);
    this.totalAmount.set(cart.total || 0);
    this.items.set(cart.items || []);
  }

  // Refresh cart and ensure signals are updated
  private refreshCart(sessionId: string): Observable<Cart> {
    return this.getCartBySessionId(sessionId).pipe(
      tap((cart) => this.updateCartState(cart))
    );
  }

  // Get cart by session ID and update state
  getCartBySessionId(sessionId: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${sessionId}`).pipe(
      tap((cart) => this.updateCartState(cart)),
      catchError((error) => {
        console.error(`Error fetching cart for session: ${sessionId}`, error);
        return of({ id: 0, sessionsId: '', items: [], total: 0, totalQuantity: 0 });
      })
    );
  }

  // Add item to cart and refresh the state
  addItemToCart(itemData: { sessionsId: string; productId: number; variantId?: number; quantity: number; isAdd: boolean }): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/item`, itemData).pipe(
      switchMap(() => this.refreshCart(itemData.sessionsId)),
      catchError((error) => {
        console.error('Error adding item to cart:', error);
        return of({ id: 0, sessionsId: '', items: [], total: 0, totalQuantity: 0 });
      })
    );
  }

  // Update item quantity and refresh the state
  updateItemQuantity(itemId: number, quantity: number, sessionId: string): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/item/${itemId}`, { quantity }).pipe(
      switchMap(() => this.refreshCart(sessionId)),
      catchError((error) => {
        console.error(`Error updating quantity for item: ${itemId}`, error);
        return of({ id: 0, sessionsId: '', items: [], total: 0, totalQuantity: 0 });
      })
    );
  }

  // Delete item from cart and refresh the state
  deleteItem(itemId: number, sessionId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/item/${itemId}`).pipe(
      switchMap(() => this.refreshCart(sessionId)),
      catchError((error) => {
        console.error(`Error deleting item: ${itemId}`, error);
        return of({ id: 0, sessionsId: '', items: [], total: 0, totalQuantity: 0 });
      })
    );
  }

  // Clear cart and reset signals
  clearCart(sessionId: string): void {
    this.http.delete(`${this.baseUrl}/${sessionId}/clear`).subscribe(
      () => {
        this.cartCount.set(0);
        this.totalAmount.set(0);
        this.items.set([]);
        console.log('Cart cleared successfully.');
      },
      (error) => console.error('Error clearing cart:', error)
    );
  }

  addAddress(
    sessionId: string,
    address: Address
  ): Observable<any> {
    const url = `${this.baseUrl}/address/${sessionId}`;
    return this.http.post(url, address);
  }
  
}
