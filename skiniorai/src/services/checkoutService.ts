import { ApiService } from './apiService';

// Custom error classes
export class CheckoutServiceError extends Error {
  constructor(message: string, public code: string, public details?: unknown) {
    super(message);
    this.name = 'CheckoutServiceError';
  }
}

// Interfaces matching backend DTOs
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

export interface OrderItem {
  productId: string;
  title: string;
  sku?: string;
  price: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customer: CustomerData;
  shippingAddress: AddressData;
  billingAddress: AddressData;
  items: OrderItem[];
  shippingMethod: string;
  currency?: string;
  discountCode?: string;
  paymentMethod?: 'stripe' | 'cod';
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

  // Create order
  async createOrder(orderData: CreateOrderRequest): Promise<{ orderId: string; order: unknown }> {
    try {
      const response = await ApiService.authenticatedFetch('/checkout/orders', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Create order error:', error);
      throw new CheckoutServiceError('Failed to create order', 'CREATE_ORDER_ERROR', error);
    }
  }

  // Process payment
  async processPayment(orderId: string, paymentData: ProcessPaymentRequest): Promise<{ success: boolean; paymentId?: string }> {
    try {
      const response = await ApiService.authenticatedFetch(`/checkout/orders/${orderId}/payment`, {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Process payment error:', error);
      throw new CheckoutServiceError('Failed to process payment', 'PROCESS_PAYMENT_ERROR', error);
    }
  }
}

export const checkoutService = new CheckoutService();