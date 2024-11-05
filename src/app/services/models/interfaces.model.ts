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
  metaKeywords: string;
  metaTitle: string;
  id: number;
  handle?: string;
  name: string;
  line?:string;
  shortName?:string
  shortDescription?:string;
  descriptionAr?: string;
  price: number;
  barcode?: string;
  brand?: string;
  isFeatured: boolean;
  categoryHandle: string;
  discountedPrice?: number;
  category: Category;
  tags?: Tag[];
  image: string;
  reviews?: Review[];
  orderItems?: OrderItem[];
  cartItems?: CartItem[];
  wishlistItems?: Wishlist[];
  variants?: Variant[];
  relatedProducts?: Product[];
  relatedBy?: Product[];
  createdAt?: Date;
  updatedAt?: Date;
  stock: number;
  metaDescription: string;
}

export interface Variant {
  id: number;
  name: string
  productId: number;
  sku: string;
  stock: number;
  image: string;
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
  handle: string
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
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
  total: number;
  product: CartProduct

}

export interface Cart {
  id: number;
  sessionsId: string;
  address?: Address;
  items: CartItem[];
  total: number;
  totalQuantity: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  phoneNumber: string;
  country: string;
}



export interface CartProduct {
  name: string,
  image: string,
}

export interface Wishlist {
  id: number;
  userId: string;
  products: Product[];
}

export interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  orderItems: OrderItem[];

  address: Address;
  phoneNumber: string;
  notes?: string;
}

export interface Banner{
  id:number   
  title    :   String
  description :String
  link        :String
  image1 ?:String
  image2 ?:String
  hexcode:string
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
  alt: string;
}
export enum OrderStatus {
  SEEN = 'SEEN',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
