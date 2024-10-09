import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewProduct, Product } from './models/product.model';
import { Category } from './models/category.model'; // Correct import


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'; // Your backend API URL
  private categoryApiUrl = 'http://localhost:3000/products/categories'; // Categories API URL

  constructor(private http: HttpClient) { }

  // Add new product with images
  addProduct(productData: NewProduct): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/create`, productData);
  }

  // Fetch categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryApiUrl);
  }

  // Fetch all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Fetch a single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Update product
  updateProduct(id: number, productData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productData);
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getProductsByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${categoryId}`);
  }
}
