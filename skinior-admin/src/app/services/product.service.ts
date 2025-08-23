import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { 
  Product, 
  CreateProductDto, 
  UpdateProductDto, 
  ProductResponse, 
  ProductListResponse 
} from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:4008/api/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<ProductListResponse>(this.apiUrl).pipe(
      map(response => response.data),
      tap(products => this.productsSubject.next(products))
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<ProductListResponse>(`${this.apiUrl}/featured`)
      .pipe(map(response => response.data));
  }

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ProductListResponse>(`${this.apiUrl}/search`, { params })
      .pipe(map(response => response.data));
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<ProductListResponse>(`${this.apiUrl}/category/${categoryId}`)
      .pipe(map(response => response.data));
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<ProductResponse>(this.apiUrl, product).pipe(
      map(response => response.data),
      tap(() => {
        // Refresh products list after creation
        this.getAllProducts().subscribe();
      })
    );
  }

  updateProduct(id: string, product: UpdateProductDto): Observable<Product> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product).pipe(
      map(response => response.data),
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
