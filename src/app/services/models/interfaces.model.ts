// src/models/product.model.ts
export interface ProductList {
  id: number;
  name: string;
  price: number;
  barcode?: string; // Make optional
  brand?: string; // Make optional
  isFeatured?: boolean;
  categoryId?: number; // Make optional
}

export interface Product {
  id: number;
  handle?: string;
  name: string;
  descriptionAr?: string;
  price: number;
  barcode?: string;
  brand?: string;
  isFeatured: boolean;
  categoryId: number;
  discountedPrice?: number;
  category: Category;
  tags?: Tag[];
  image: String;
  reviews?: Review[];
  orderItems?: OrderItem[];
  cartItems?: CartItem[];
  wishlistItems?: Wishlist[];
  variants?: Variant[];
  relatedProducts?: Product[];
  relatedBy?: Product[];
  createdAt?: Date;
  updatedAt?: Date;
  items: items[];
}

export interface items {
  id: number;
  productId: number;
  sku: string;
  stock: number;
  image: string;
  price: number;
  discountedPrice: number;
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  barcode: string;
  brand: string;
  isFeatured: boolean;
  // images?: File[]; // If you're handling image uploads
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image: string;
  products: Product[];
}

export interface Tag {
  id: number;
  name: string;
  products: Product[];
}

export interface Image {
  id: number;
  url: string;
  altText?: string;
  productId?: number;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  productId: number;
  userId: string;
  createdAt: Date;
}
export interface Variant {
  id: number;
  name: string;
  image: string;
  products: Product[];
  orderItems: OrderItem[];
  cartItems: CartItem[];
}
export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  productId: number;
  variantId?: number;
  product: Product;
  variant?: Variant;
  order: Order;
}

export interface CartItem {
  id: number;
  quantity: number;
  productId: number;
  variantId?: number;
  product: Product;
  variant?: Variant;
  cart: Cart;
}

export interface Wishlist {
  id: number;
  userId: string;
  products: Product[];
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  orderItems: OrderItem[];
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  phoneNumber: string;
  notes?: string;
}

export interface Cart {
  id: number;
  userId?: string;
  items: CartItem[];
}

export interface Profile {
  id: number;
  userId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
export interface HeroContent {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  learnMoreText: string;
  learnMoreLink: string;
  imageUrl: string;
}
export enum OrderStatus {
  SEEN = 'SEEN',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
