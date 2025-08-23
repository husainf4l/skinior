import { ApiService } from './apiService';

// Custom error classes
export class CheckoutServiceError extends Error {
  constructor(message: string, public code: string, public details?: unknown) {
    super(message);
    this.name = 'CheckoutServiceError';
  }
}

// Guest Checkout System Interfaces
export interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CreateOrderRequest {
  customer: Customer;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  items: OrderItem[];
  shippingMethod: string;
  currency: string;
  paymentMethod: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  customerEmail: string;
  accountCreated: boolean;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface LinkAccountRequest {
  email: string;
  password: string;
}

export interface OrderHistoryResponse {
  orders: OrderResponse[];
  totalOrders: number;
}

// Legacy interfaces for backward compatibility
export interface CustomerData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AddressData {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface ProcessPaymentRequest {
  paymentMethodId: string;
  paymentType?: 'stripe' | 'cod';
  savePaymentMethod?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  description: string;
  available: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

export class CheckoutService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4008/api';

  // Guest Checkout System Methods

  // Create order with guest checkout
  async createOrder(orderData: CreateOrderRequest): Promise<{ data: OrderResponse }> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw new CheckoutServiceError('Failed to create order', 'CREATE_ORDER_ERROR', error);
    }
  }

  // Link guest account with password
  async linkAccount(linkData: LinkAccountRequest): Promise<{ data: { message: string; email: string } }> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout/link-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });

      if (!response.ok) {
        throw new Error(`Account linking failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Account linking error:', error);
      throw new CheckoutServiceError('Failed to link account', 'LINK_ACCOUNT_ERROR', error);
    }
  }

  // Get order history by email
  async getOrderHistory(email: string): Promise<{ data: OrderHistoryResponse }> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout/order-history?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order history: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Order history error:', error);
      throw new CheckoutServiceError('Failed to get order history', 'GET_ORDER_HISTORY_ERROR', error);
    }
  }

  // Legacy Methods (for backward compatibility)
  // Get available payment methods for a country
  async getPaymentMethods(country: string): Promise<PaymentMethod[]> {
    try {
      const response = await ApiService.authenticatedFetch('/checkout/payment-methods', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ country })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw new CheckoutServiceError('Failed to get payment methods', 'GET_PAYMENT_METHODS_ERROR', error);
    }
  }

  // Calculate shipping options
  async calculateShipping(shippingAddress: AddressData): Promise<ShippingOption[]> {
    try {
      const response = await ApiService.authenticatedFetch('/checkout/shipping', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ shippingAddress })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Calculate shipping error:', error);
      throw new CheckoutServiceError('Failed to calculate shipping', 'CALCULATE_SHIPPING_ERROR', error);
    }
  }

  // Apply discount code
  async applyDiscount(cartTotal: number, discountCode: string): Promise<{ discount: number; message: string }> {
    try {
      const response = await ApiService.authenticatedFetch('/checkout/discount', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ cartTotal, discountCode })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Apply discount error:', error);
      throw new CheckoutServiceError('Failed to apply discount', 'APPLY_DISCOUNT_ERROR', error);
    }
  }
}

export const checkoutService = new CheckoutService();