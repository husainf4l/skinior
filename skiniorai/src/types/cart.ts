// Cart Type Definitions
import { type ProductAttributeValue } from "./product";

export interface CartItemAttribute {
  attributeName: string;
  value: ProductAttributeValue;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  image: string;
  title: string;
  titleAr?: string;
  attributes?: CartItemAttribute[];
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  attributes?: CartItemAttribute[];
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

export interface CartError {
  code: string;
  message: string;
  details?: unknown;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  error: CartError | null;
}
