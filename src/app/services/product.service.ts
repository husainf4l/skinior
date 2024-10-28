import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { Category, NewProduct, Product } from './models/interfaces.model';


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`
  private categoryApiUrl = `${environment.apiUrl}/categories`;

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

  getFeaturedProducts(categoryHandle: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured/${categoryHandle}`);
  }

  // Fetch a single product by ID  
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductByHandle(handle: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/handle/${handle}`);
  }
  // Update product using JSON data
  updateProduct(id: number, productData: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productData);
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getProductsByCategoryHandle(categoryHandle: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${categoryHandle}`);
  }
  getProductsByBRAND(brand: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/brand/${brand}`);
  }
  searchProducts(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
