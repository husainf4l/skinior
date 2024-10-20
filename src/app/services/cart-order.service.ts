// src/app/services/cart-order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { catchError, of, Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { Variant } from './models/interfaces.model';

interface CartItem {
    product: {
        id: number;
        brand: string;
        name: string;
        price: number;
        images: Array<{
            id: string;
            url: string;
            altText: string;
        }
        >;
        variant?: Variant;

    };
    quantity: number;
}

@Injectable({
    providedIn: 'root',
})
export class CartOrderService {
    // Signal to track cart items
    private cartItemsSignal = signal<CartItem[]>([]);

    // Computed signal to track total amount
    private totalAmountSignal = computed(() =>
        this.cartItemsSignal().reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        )
    );

    // Computed signal to track total quantity of items
    public totalQuantity = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
    );

    // Signal to track phone number
    private phoneNumberSignal = signal<string | null>(null);

    private backendUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {
        this.loadCartFromLocalStorage();
        this.loadPhoneNumber();
    }

    // Set phone number
    setPhoneNumber(phoneNumber: string) {
        this.phoneNumberSignal.set(phoneNumber);
        localStorage.setItem('phoneNumber', phoneNumber);
    }

    // Add product to the cart
    addToCart(product: any, quantity: number = 1, variantId?: number) {
        this.getOrCreateCartId()
            .then((cartId) => {
                this.updateLocalCart(product, quantity);
                this.addToCartBackend(product.id, quantity, cartId, variantId);
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
            });
    }

    private updateLocalCart(product: any, quantity: number) {
        const currentCart = [...this.cartItemsSignal()];
        const existingItemIndex = currentCart.findIndex(
            (item) => item.product.id === product.id
        );

        if (existingItemIndex >= 0) {
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            currentCart.push({ product, quantity });
        }

        this.cartItemsSignal.set(currentCart);
        this.saveCartToLocalStorage();
    }

    private getOrCreateCartId(): Promise<number> {
        return new Promise((resolve, reject) => {
            const cartId = this.getCartIdFromLocalStorage();

            if (cartId !== null) {
                resolve(cartId);
            } else {
                this.createCart().subscribe({
                    next: (response: any) => {
                        if (response && response.id) {
                            const newCartId = response.id;
                            this.storeCartIdInLocalStorage(newCartId);
                            resolve(newCartId);
                        } else {
                            reject('Failed to create cart: Invalid response');
                        }
                    },
                    error: (error) => {
                        reject(error);
                    },
                });
            }
        });
    }

    private createCart(): Observable<any> {
        return this.http.post(`${this.backendUrl}/cart`, {}).pipe(
            catchError((error) => this.handleError('Create Cart', error))
        );
    }

    private addToCartBackend(
        productId: number,
        quantity: number,
        cartId: number,
        variantId?: number
    ) {
        const body = { cartId, productId, quantity, variantId };
        this.http
            .post(`${this.backendUrl}/cart/add`, body)
            .pipe(catchError((error) => this.handleError('Add to Cart Backend', error)))
            .subscribe({
                next: () => {
                    // Item added successfully
                },
                error: (error) => {
                    console.error('Error adding to cart backend:', error);
                },
            });
    }

    private storeCartIdInLocalStorage(cartId: number) {
        localStorage.setItem('cartId', cartId.toString());
    }

    private getCartIdFromLocalStorage(): number | null {
        const cartIdString = localStorage.getItem('cartId');
        const cartId = cartIdString ? Number(cartIdString) : null;
        return cartId !== null && !isNaN(cartId) ? cartId : null;
    }

    // Remove product from the cart
    removeFromCart(productId: number) {
        const updatedCart = this.cartItemsSignal().filter(
            (item) => item.product.id !== productId
        );
        this.cartItemsSignal.set(updatedCart);
        this.saveCartToLocalStorage();

        const cartId = this.getCartIdFromLocalStorage();

        if (cartId !== null) {
            this.removeFromCartBackend(productId, cartId);
        } else {
            console.error('Cart ID is missing or invalid');
        }
    }

    private removeFromCartBackend(productId: number, cartId: number) {
        const body = { cartId };
        this.http
            .delete(`${this.backendUrl}/cart/remove/${productId}`, { body })
            .pipe(catchError((error) => this.handleError('Remove from Cart Backend', error)))
            .subscribe({
                next: () => {
                    // Item removed successfully
                },
                error: (error) => {
                    console.error('Error removing from cart backend:', error);
                },
            });
    }

    // Clear cart
    clearCart() {
        this.cartItemsSignal.set([]);
        localStorage.removeItem('cart');
        localStorage.removeItem('phoneNumber');

        const cartId = this.getCartIdFromLocalStorage();

        if (cartId !== null) {
            const body = { cartId };
            this.http
                .delete(`${this.backendUrl}/cart/clear`, { body })
                .pipe(catchError((error) => this.handleError('Clear Cart', error)))
                .subscribe({
                    next: () => {
                        localStorage.removeItem('cartId');
                    },
                    error: (error) => {
                        console.error('Error clearing cart:', error);
                    },
                });
        } else {
            console.error('Cart ID is missing or invalid');
        }
    }

    private saveCartToLocalStorage() {
        const cartItems = this.cartItemsSignal();
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    private loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const cartItems = JSON.parse(storedCart) as CartItem[];
            this.cartItemsSignal.set(cartItems);
        }
        this.loadPhoneNumber();
    }

    private loadPhoneNumber() {
        const storedPhoneNumber = localStorage.getItem('phoneNumber');
        if (storedPhoneNumber) {
            this.phoneNumberSignal.set(storedPhoneNumber);
        }
    }

    private buildHttpParams(cartId: number): HttpParams {
        let params = new HttpParams();
        params = params.set('cartId', cartId.toString());
        return params;
    }

    private handleError(operation = 'operation', error: any) {
        console.error(`${operation} failed:`, error);
        return of(null);
    }

    // Exposed methods to access cart signals
    get cartItems() {
        return this.cartItemsSignal;
    }

    get totalAmount() {
        return this.totalAmountSignal;
    }

    get phoneNumber() {
        return this.phoneNumberSignal;
    }

    // Place order
    placeOrder(order: any) {
        return this.http
            .post(`${this.backendUrl}/orders`, order)
            .pipe(
                catchError((error) => {
                    console.error('Error placing order:', error);
                    return of(null);
                })
            );
    }
}
