import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../enviroments/enviroment';
import { of } from 'rxjs';

interface CartItem {
    product: {
        id: number;
        brand: string;
        name: string;
        price: number;
        images: [
            {
                id: string;
                url: string;
                altText: string;
            }
        ];
    };
    quantity: number;
}

interface ShippingAddress {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
}

@Injectable({
    providedIn: 'root',
})
export class CartOrderService {
    // Signal to track cart items
    private cartItemsSignal = signal<CartItem[]>([]);

    // Computed signal to track total amount based on cartItemsSignal
    private totalAmountSignal = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    );

    // Computed signal to track total quantity of items
    private totalQuantitySignal = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
    );

    // Signal to track shipping address
    private shippingAddressSignal = signal<ShippingAddress | null>(null);

    private backendUrl = `${environment.apiUrl}/cart`;

    constructor(private http: HttpClient) {
        // Load cart from localStorage if available
        this.loadCartFromLocalStorage();
    }

    // Add shipping address
    setShippingAddress(address: ShippingAddress) {
        this.shippingAddressSignal.set(address);
        localStorage.setItem('shippingAddress', JSON.stringify(address));
    }

    // Load shipping address from localStorage
    loadShippingAddress() {
        const storedAddress = localStorage.getItem('shippingAddress');
        if (storedAddress) {
            const address = JSON.parse(storedAddress);
            this.shippingAddressSignal.set(address);
        }
    }

    // Add product to the cart
    addToCart(product: any, quantity: number = 1, userId: string | null = null, sessionId: string | null = null) {
        const currentCart = [...this.cartItemsSignal()];
        const existingItemIndex = currentCart.findIndex((item) => item.product.id === product.id);

        if (existingItemIndex >= 0) {
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            currentCart.push({ product, quantity });
        }

        this.cartItemsSignal.set(currentCart);
        this.saveCartToLocalStorage();
        return this.syncWithBackend('add', product.id, quantity, userId, sessionId);
    }

    // Remove product from the cart
    removeFromCart(productId: number, userId: string | null = null, sessionId: string | null = null) {
        const updatedCart = this.cartItemsSignal().filter((item) => item.product.id !== productId);
        this.cartItemsSignal.set(updatedCart);
        this.saveCartToLocalStorage();
        return this.syncWithBackend('remove', productId, 0, userId, sessionId);
    }

    // Clear cart
    clearCart(userId: string | null = null, sessionId: string | null = null) {
        this.cartItemsSignal.set([]);
        localStorage.removeItem('cart');
        localStorage.removeItem('shippingAddress');
        const params = this.buildHttpParams(userId, sessionId);
        return this.http.delete(`${this.backendUrl}/clear`, { params }).pipe(
            catchError((error) => this.handleError('Clear Cart', error))
        );
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
        this.loadShippingAddress(); // Load shipping address as well
    }

    private syncWithBackend(action: 'add' | 'remove', productId: number, quantity: number, userId: string | null, sessionId: string | null) {
        const params = this.buildHttpParams(userId, sessionId);
        const body = { productId, quantity };
        let url = `${this.backendUrl}/${action}`;
        if (action === 'remove') {
            url = `${this.backendUrl}/remove/${productId}`;
        }
        return this.http.post(url, body, { params }).pipe(
            catchError((error) => this.handleError(`Sync Cart - ${action}`, error))
        ).subscribe();
    }

    private buildHttpParams(userId: string | null, sessionId: string | null): HttpParams {
        let params = new HttpParams();
        if (userId) {
            params = params.set('userId', userId);
        }
        if (sessionId) {
            params = params.set('sessionId', sessionId);
        }
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

    get totalQuantity() {
        return this.totalQuantitySignal;
    }

    get shippingAddress() {
        return this.shippingAddressSignal;
    }


    placeOrder(order: any) {
        return this.http.post(`${this.backendUrl}/place-order`, order)
            .pipe(
                catchError((error) => {
                    console.error('Error placing order:', error);
                    return of(null);
                })
            );
    }

}
