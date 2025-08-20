import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product, CreateProductDto, UpdateProductDto } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:4008/api/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => this.productsSubject.next(products))
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`);
  }

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(() => {
        // Refresh products list after creation
        this.getAllProducts().subscribe();
      })
    );
  }

  updateProduct(id: string, product: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap(() => {
        // Refresh products list after update
        this.getAllProducts().subscribe();
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Refresh products list after deletion
        this.getAllProducts().subscribe();
      })
    );
  }
}
