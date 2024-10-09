import { Category } from './category.model'; // Correct import


export interface Image {
  id?: number;
  url: string;
  altText?: string;
}


export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  images: Array<{
    id: string;
    url: string;
    altText: string;
  }>;
  category: Category; // Use the imported Category interface
  barcode?: string; // Optional: Barcode of the product
  isFeatured?: boolean; // Optional: Featured status
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
