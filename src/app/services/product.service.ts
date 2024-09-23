import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces matching your NestJS data structures
export interface Variant {
  id?: number;
  name: string;
  price: number;
  stock: number;
  sku?: string;
  attributes: { key: string; value: string }[]; // List of attributes like color, size, etc.
  images: { url: string; altText?: string }[]; // Variant images
}

export interface Image {
  id?: number;
  url: string;
  altText?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductAttribute {
  key: string;
  value: string;
}

export interface Review {
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  slug: string;
  brand: string;
  isFeatured: boolean;
  isTopLine: boolean;
  images: { id?: number, url: string, altText?: string }[];
  categories: { categoryId: number, category: { id: number, name: string } }[];
  attributes: { key: string, value: string }[];
  variants: { id: number, name: string, price: number, stock: number, attributes: { key: string, value: string }[], images: { url: string, altText: string }[] }[];
  reviews: { id: number, rating: number, comment: string }[];
  relatedProducts: RelatedProduct[]; // Change this to use the RelatedProduct interface
}



export interface RelatedProduct {
  productId: number;
  relatedProductId: number;
  relatedProduct: Product; // Add this to include the full product details
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'; // Backend API URL
  private categoriesUrl = 'http://localhost:3000/categories'; // Categories API URL
  private relatedProductsUrl = 'http://localhost:3000/products/related'; // URL to fetch related products

  constructor(private http: HttpClient) { }

  // Get all products with optional query parameters
  getProducts(params?: any): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    return this.http.get<Product[]>(this.apiUrl, { params: httpParams });
  }

  // Get a single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  // Add a new product
  addProduct(product: Product): Observable<Product> {
    const payload = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      slug: product.slug,
      brand: product.brand,
      isFeatured: product.isFeatured,
      isTopLine: product.isTopLine,
      categories: product.categories, // Category IDs
      images: product.images, // Images
      attributes: product.attributes || [], // Optional attributes
      variants: product.variants || [], // Optional variants
      relatedProducts: product.relatedProducts || [], // Related product IDs
      reviews: product.reviews || [], // Optional reviews
    };

    return this.http.post<Product>(this.apiUrl, payload);
  }

  // Update an existing product
  updateProduct(id: number, product: Product): Observable<Product> {
    const payload = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      slug: product.slug,
      brand: product.brand,
      isFeatured: product.isFeatured,
      isTopLine: product.isTopLine,
      categories: product.categories,
      images: product.images,
      attributes: product.attributes || [],
      variants: product.variants || [],
      relatedProducts: product.relatedProducts || [], // Related product IDs
      reviews: product.reviews || [],
    };

    return this.http.patch<Product>(`${this.apiUrl}/${id}`, payload);
  }

  // Get related products by a product ID
  getRelatedProducts(productId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.relatedProductsUrl}/${productId}`);
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
