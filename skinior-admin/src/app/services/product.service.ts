import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { 
  Product, 
  CreateProductDto, 
  UpdateProductDto, 
  ProductListResponse 
} from '../interfaces/product.interface';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  skinType?: string;
  concerns?: string; // comma-separated values
  isFeatured?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  onSale?: boolean;
  sortBy?: 'price' | 'createdAt' | 'title' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export // API Response interfaces
interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

interface WrappedProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters?: any;
  };
  message?: string;
  timestamp?: string;
}

interface PaginatedProductResponse {
  products: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'https://skinior.com/api/products';
  private readonly adminApiUrl = 'https://skinior.com/api/admin/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get products with pagination, search, and filters
   */
  getProducts(params?: ProductQueryParams): Observable<{ products: Product[]; pagination?: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.brand) httpParams = httpParams.set('brand', params.brand);
      if (params.minPrice) httpParams = httpParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
      if (params.skinType) httpParams = httpParams.set('skinType', params.skinType);
      if (params.concerns) httpParams = httpParams.set('concerns', params.concerns);
      if (params.isFeatured !== undefined) httpParams = httpParams.set('isFeatured', params.isFeatured.toString());
      if (params.isNew !== undefined) httpParams = httpParams.set('isNew', params.isNew.toString());
      if (params.isActive !== undefined) httpParams = httpParams.set('isActive', params.isActive.toString());
      if (params.onSale !== undefined) httpParams = httpParams.set('onSale', params.onSale.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map((response: any) => {
        // Handle both direct array response and paginated response
        if (Array.isArray(response)) {
          return { products: response };
        } else if (response && response.success && response.data) {
          // Handle wrapped API response with success field
          const data = response.data;
          if (data.products && Array.isArray(data.products)) {
            return { 
              products: data.products, 
              pagination: data.pagination 
            };
          } else if (Array.isArray(data)) {
            return { products: data };
          } else {
            return { products: [] };
          }
        } else if (response && response.data && response.data.products) {
          return { 
            products: response.data.products, 
            pagination: response.data.pagination 
          };
        } else if (response && response.data && Array.isArray(response.data)) {
          return { products: response.data };
        } else {
          return { products: [] };
        }
      }),
      tap(result => this.productsSubject.next(result.products))
    );
  }

  /**
   * Get all products (legacy method - now uses getProducts)
   */
  getAllProducts(): Observable<Product[]> {
    return this.getProducts().pipe(
      map(result => result.products)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => {
        // Handle both direct product response and wrapped response
        if (response && response.success && response.data) {
          return response.data;
        } else if (response && response.data) {
          return response.data;
        } else {
          return response as Product;
        }
      })
    );
  }

  getFeaturedProducts(params?: Omit<ProductQueryParams, 'isFeatured'>): Observable<Product[]> {
    const featuredParams: ProductQueryParams = { ...params, isFeatured: true };
    return this.getProducts(featuredParams).pipe(
      map(result => result.products)
    );
  }

  searchProducts(query: string, params?: Omit<ProductQueryParams, 'search'>): Observable<Product[]> {
    const searchParams: ProductQueryParams = { ...params, search: query };
    return this.getProducts(searchParams).pipe(
      map(result => result.products)
    );
  }

  getProductsByCategory(categoryId: string, params?: Omit<ProductQueryParams, 'category'>): Observable<Product[]> {
    const categoryParams: ProductQueryParams = { ...params, category: categoryId };
    return this.getProducts(categoryParams).pipe(
      map(result => result.products)
    );
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<any>(this.apiUrl, product).pipe(
      map((response: any) => {
        // Handle both direct product response and wrapped response
        if (response && response.success && response.data) {
          return response.data;
        } else if (response && response.data) {
          return response.data;
        } else {
          return response as Product;
        }
      }),
      tap(() => {
        // Refresh products list after creation
        this.getAllProducts().subscribe();
      })
    );
  }

  updateProduct(id: string, product: UpdateProductDto): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product).pipe(
      map((response: any) => {
        // Handle both direct product response and wrapped response
        if (response && response.success && response.data) {
          return response.data;
        } else if (response && response.data) {
          return response.data;
        } else {
          return response as Product;
        }
      }),
      tap(() => {
        // Refresh products list after update
        this.getAllProducts().subscribe();
      })
    );
  }

    /**
   * Get products with advanced filtering options
   */
  getProductsAdvanced(params: ProductQueryParams): Observable<{ products: Product[]; pagination?: any }> {
    return this.getProducts(params);
  }

  /**
   * Get low stock products - Note: This functionality should be handled by your backend
   * For now, we'll use a generic product fetch with a note
   */
  getLowStockProducts(): Observable<Product[]> {
    // Since the backend doesn't have a direct stockStatus filter,
    // we'll get all products and let the backend handle stock logic
    return this.getProducts({ limit: 100 }).pipe(
      map(result => result.products.filter(product => (product.stockQuantity || 0) <= 10))
    );
  }

  /**
   * Get products by active status
   */
  getProductsByStatus(isActive: boolean): Observable<Product[]> {
    return this.getProducts({ isActive }).pipe(
      map(result => result.products)
    );
  }

  /**
   * Get products on sale (with compareAtPrice)
   */
  getProductsOnSale(params?: Omit<ProductQueryParams, 'onSale'>): Observable<Product[]> {
    const saleParams: ProductQueryParams = { ...params, onSale: true };
    return this.getProducts(saleParams).pipe(
      map(result => result.products)
    );
  }

  /**
   * Get new products
   */
  getNewProducts(params?: Omit<ProductQueryParams, 'isNew'>): Observable<Product[]> {
    const newParams: ProductQueryParams = { ...params, isNew: true };
    return this.getProducts(newParams).pipe(
      map(result => result.products)
    );
  }

  /**
   * Get products by price range
   */
  getProductsByPriceRange(minPrice: number, maxPrice: number, params?: Omit<ProductQueryParams, 'minPrice' | 'maxPrice'>): Observable<Product[]> {
    const priceParams: ProductQueryParams = { ...params, minPrice, maxPrice };
    return this.getProducts(priceParams).pipe(
      map(result => result.products)
    );
  }

  /**
   * Get products by skin type
   */
  getProductsBySkinType(skinType: string, params?: Omit<ProductQueryParams, 'skinType'>): Observable<Product[]> {
    const skinTypeParams: ProductQueryParams = { ...params, skinType };
    return this.getProducts(skinTypeParams).pipe(
      map(result => result.products)
    );
  }

  /**
   * Get products by concerns
   */
  getProductsByConcerns(concerns: string[], params?: Omit<ProductQueryParams, 'concerns'>): Observable<Product[]> {
    const concernsParams: ProductQueryParams = { ...params, concerns: concerns.join(',') };
    return this.getProducts(concernsParams).pipe(
      map(result => result.products)
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`).pipe(
      tap(() => {
        // Refresh products list after deletion
        this.getAllProducts().subscribe();
      })
    );
  }

  /**
   * Delete multiple products by IDs
   */
  deleteProducts(ids: string[]): Observable<void> {
    return this.http.delete<void>(this.adminApiUrl, {
      body: { productIds: ids },
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(() => {
        // Refresh products list after bulk deletion
        this.getAllProducts().subscribe();
      })
    );
  }

  /**
   * Delete ALL products in the database
   */
  deleteAllProducts(): Observable<any> {
    return this.http.delete<any>(this.adminApiUrl, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(() => {
        // Refresh products list after deletion
        this.getAllProducts().subscribe();
      })
    );
  }
}
