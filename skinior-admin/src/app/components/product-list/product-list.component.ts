import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="product-list-container apple-fade-in">
      <!-- Header Section -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title apple-title">Products</h1>
          <p class="page-subtitle apple-body">Manage your skincare product catalog</p>
        </div>
        <button 
          class="add-button apple-button apple-button-primary"
          (click)="navigateToAddProduct()">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="search-filter-section apple-card">
        <div class="search-container">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search products</mat-label>
            <input 
              matInput 
              placeholder="Search by name, SKU, or description..."
              [ngModel]="searchQuery()"
              (ngModelChange)="updateSearchQuery($event)"
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        
        <div class="filter-chips">
          <mat-chip-set>
            <mat-chip 
              [class.selected]="selectedFilter() === 'all'"
              (click)="setFilter('all')">
              All Products
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'all'">check</mat-icon>
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'featured'"
              (click)="setFilter('featured')">
              Featured
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'featured'">check</mat-icon>
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'low-stock'"
              (click)="setFilter('low-stock')">
              Low Stock
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'low-stock'">check</mat-icon>
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'new'"
              (click)="setFilter('new')">
              New Products
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'new'">check</mat-icon>
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Products List -->
      <div class="products-section" *ngIf="!loading() && paginatedProducts().length > 0">
        <div class="apple-list apple-slide-up">
          <div 
            *ngFor="let product of paginatedProducts(); trackBy: trackByProductId" 
            class="product-item apple-list-item">
            
            <div class="product-content">
              <div class="product-main">
                <div class="product-image-container">
                  <img 
                    [src]="getMainImage(product) || '/assets/images/no-image.svg'" 
                    [alt]="product.title"
                    class="product-image"
                    (error)="onImageError($event)"
                  />
                </div>
                
                <div class="product-info">
                  <div class="product-header">
                    <h3 class="product-title apple-headline">{{ product.title }}</h3>
                    <div class="product-badges">
                      <span class="apple-badge apple-badge-primary" *ngIf="product.isFeatured">
                        <mat-icon>star</mat-icon>
                        Featured
                      </span>
                      <span class="apple-badge apple-badge-success" *ngIf="product.isNew">
                        <mat-icon>fiber_new</mat-icon>
                        New
                      </span>
                      <span 
                        class="apple-badge"
                        [class.apple-badge-success]="(product.stockQuantity || 0) > 10"
                        [class.apple-badge-warning]="(product.stockQuantity || 0) <= 10 && (product.stockQuantity || 0) > 0"
                        [class.apple-badge-danger]="(product.stockQuantity || 0) === 0">
                        {{ (product.stockQuantity || 0) === 0 ? 'Out of Stock' : (product.stockQuantity || 0) + ' in stock' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="product-meta">
                    <p class="product-description apple-body">
                      {{ (product.descriptionEn || '') | slice:0:120 }}<span *ngIf="(product.descriptionEn || '').length > 120">...</span>
                    </p>
                    
                    <div class="product-details">
                      <div class="detail-item">
                        <mat-icon class="detail-icon">local_offer</mat-icon>
                        <span class="apple-caption">SKU: {{ product.sku || 'N/A' }}</span>
                      </div>
                      <div class="detail-item">
                        <mat-icon class="detail-icon">category</mat-icon>
                        <span class="apple-caption">{{ product.category || product.categoryId || 'Uncategorized' }}</span>
                      </div>
                      <div class="detail-item" *ngIf="product.skinType">
                        <mat-icon class="detail-icon">face</mat-icon>
                        <span class="apple-caption">{{ product.skinType }}</span>
                      </div>
                      <div class="detail-item" *ngIf="product.activeIngredients">
                        <mat-icon class="detail-icon">science</mat-icon>
                        <span class="apple-caption">{{ product.activeIngredients | slice:0:30 }}{{ (product.activeIngredients || '').length > 30 ? '...' : '' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="product-actions">
                <div class="price-section">
                  <div class="current-price apple-headline">
                    \${{ product.price | number:'1.2-2' }}
                  </div>
                  <div class="compare-price apple-caption" *ngIf="product.compareAtPrice && product.compareAtPrice > product.price">
                    <span class="strikethrough">\${{ product.compareAtPrice | number:'1.2-2' }}</span>
                  </div>
                </div>
                
                <div class="action-buttons">
                  <button 
                    class="apple-button apple-button-secondary"
                    (click)="editProduct(product)"
                    matTooltip="Edit product">
                    <mat-icon>edit</mat-icon>
                    Edit
                  </button>
                  <button 
                    class="apple-button apple-button-secondary"
                    (click)="viewProduct(product)"
                    matTooltip="View details">
                    <mat-icon>visibility</mat-icon>
                    View
                  </button>
                  <button 
                    class="apple-button apple-button-danger"
                    (click)="deleteProduct(product)"
                    matTooltip="Delete product">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state apple-card" *ngIf="!loading() && paginatedProducts().length === 0">
        <div class="empty-content">
          <mat-icon class="empty-icon">inventory_2</mat-icon>
          <h2 class="apple-headline">No products found</h2>
          <p class="apple-body" *ngIf="searchQuery()">
            Try adjusting your search criteria or filters
          </p>
          <p class="apple-body" *ngIf="!searchQuery()">
            Get started by adding your first skincare product
          </p>
          <button 
            class="apple-button apple-button-primary"
            (click)="navigateToAddProduct()"
            *ngIf="!searchQuery()">
            <mat-icon>add</mat-icon>
            Add Your First Product
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state apple-card" *ngIf="loading()">
        <div class="loading-content">
          <mat-spinner diameter="40"></mat-spinner>
          <p class="apple-body">Loading products...</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-section apple-card" *ngIf="filteredProducts().length > pageSize()">
        <mat-paginator
          [length]="filteredProducts().length"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[10, 25, 50, 100]"
          [pageIndex]="currentPage()"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
      display: flex;
      flex-direction: column;
      gap: var(--apple-spacing-lg);
      min-height: calc(100vh - 120px);
    }

    /* Header Section */
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--apple-spacing-lg);
    }

    .title-section {
      flex: 1;
    }

    .page-title {
      margin-bottom: var(--apple-spacing-xs);
    }

    .page-subtitle {
      margin: 0;
      color: var(--apple-text-secondary);
    }

    .add-button {
      min-width: 140px;
      height: 44px;
      white-space: nowrap;
    }

    /* Search and Filter Section */
    .search-filter-section {
      padding: var(--apple-spacing-lg);
    }

    .search-container {
      margin-bottom: var(--apple-spacing-md);
    }

    .search-field {
      width: 100%;
      max-width: 500px;
    }

    .filter-chips mat-chip-set {
      display: flex;
      gap: var(--apple-spacing-sm);
      flex-wrap: wrap;
    }

    .filter-chips mat-chip {
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--apple-gray-6);
      color: var(--apple-text-secondary);
    }

    .filter-chips mat-chip.selected {
      background: var(--apple-blue) !important;
      color: white !important;
    }

    .filter-chips mat-chip:hover:not(.selected) {
      background: var(--apple-gray-5);
    }

    /* Products List */
    .products-section {
      flex: 1;
    }

    .product-item {
      padding: var(--apple-spacing-lg);
    }

    .product-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--apple-spacing-lg);
      width: 100%;
    }

    .product-main {
      display: flex;
      gap: var(--apple-spacing-md);
      flex: 1;
      min-width: 0;
    }

    .product-image-container {
      width: 80px;
      height: 80px;
      border-radius: var(--apple-radius-md);
      overflow: hidden;
      flex-shrink: 0;
      background: var(--apple-gray-6);
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s ease;
    }

    .product-info {
      flex: 1;
      min-width: 0;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--apple-spacing-md);
      margin-bottom: var(--apple-spacing-sm);
    }

    .product-title {
      margin: 0;
      color: var(--apple-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0;
    }

    .product-badges {
      display: flex;
      gap: var(--apple-spacing-xs);
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .product-meta {
      display: flex;
      flex-direction: column;
      gap: var(--apple-spacing-sm);
    }

    .product-description {
      margin: 0;
      line-height: 1.4;
    }

    .product-details {
      display: flex;
      gap: var(--apple-spacing-md);
      flex-wrap: wrap;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--apple-spacing-xs);
    }

    .detail-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--apple-text-tertiary);
    }

    /* Product Actions */
    .product-actions {
      display: flex;
      flex-direction: column;
      gap: var(--apple-spacing-md);
      align-items: flex-end;
      flex-shrink: 0;
    }

    .price-section {
      text-align: right;
    }

    .current-price {
      margin: 0;
      color: var(--apple-green);
      font-weight: 700;
    }

    .compare-price {
      margin: 0;
      color: var(--apple-text-tertiary);
    }

    .strikethrough {
      text-decoration: line-through;
    }

    .action-buttons {
      display: flex;
      gap: var(--apple-spacing-sm);
    }

    .action-buttons .apple-button {
      min-width: auto;
      padding: 8px 12px;
      font-size: 14px;
    }

    /* Empty State */
    .empty-state, .loading-state {
      padding: var(--apple-spacing-2xl);
      text-align: center;
    }

    .empty-content, .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--apple-spacing-md);
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--apple-gray-3);
      margin-bottom: var(--apple-spacing-sm);
    }

    .loading-content mat-spinner {
      margin-bottom: var(--apple-spacing-md);
    }

    /* Pagination */
    .pagination-section {
      padding: var(--apple-spacing-md) var(--apple-spacing-lg);
      display: flex;
      justify-content: center;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        gap: var(--apple-spacing-md);
      }

      .add-button {
        width: 100%;
      }

      .product-content {
        flex-direction: column;
        align-items: stretch;
        gap: var(--apple-spacing-md);
      }

      .product-main {
        width: 100%;
      }

      .product-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--apple-spacing-sm);
      }

      .product-badges {
        justify-content: flex-start;
      }

      .product-actions {
        align-items: stretch;
      }

      .price-section {
        text-align: left;
      }

      .action-buttons {
        width: 100%;
        justify-content: space-between;
      }

      .action-buttons .apple-button {
        flex: 1;
      }

      .product-details {
        flex-direction: column;
        gap: var(--apple-spacing-xs);
      }
    }

    @media (max-width: 480px) {
      .product-image-container {
        width: 60px;
        height: 60px;
      }

      .filter-chips mat-chip-set {
        justify-content: center;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  // Injected services
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  // Signals for reactive state management
  private readonly allProducts = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly searchQuery = signal('');
  readonly selectedFilter = signal<'all' | 'featured' | 'low-stock' | 'new'>('all');
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);

  // Computed properties
  readonly filteredProducts = computed(() => {
    let products = this.allProducts();
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedFilter();

    // Apply text search
    if (query) {
      products = products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        (product.descriptionEn || '').toLowerCase().includes(query) ||
        (product.sku || '').toLowerCase().includes(query) ||
        (product.categoryId || '').toLowerCase().includes(query) ||
        (product.activeIngredients || '').toLowerCase().includes(query) ||
        (product.skinType || '').toLowerCase().includes(query)
      );
    }

    // Apply filters
    switch (filter) {
      case 'featured':
        products = products.filter(product => product.isFeatured);
        break;
      case 'low-stock':
        products = products.filter(product => (product.stockQuantity || 0) <= 10);
        break;
      case 'new':
        products = products.filter(product => product.isNew);
        break;
    }

    return products;
  });

  readonly paginatedProducts = computed(() => {
    const products = this.filteredProducts();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = page * size;
    
    return products.slice(startIndex, startIndex + size);
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading.set(false);
      }
    });
  }

  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(0); // Reset to first page
  }

  setFilter(filter: 'all' | 'featured' | 'low-stock' | 'new'): void {
    this.selectedFilter.set(filter);
    this.currentPage.set(0); // Reset to first page
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/products/add']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(`Are you sure you want to delete "${product.title}"?`);
    if (!confirmed) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        // Remove from local state
        const updatedProducts = this.allProducts().filter(p => p.id !== product.id);
        this.allProducts.set(updatedProducts);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    });
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  getMainImage(product: Product): string | null {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find(img => img.isMain);
      return mainImage?.url || product.images[0].url;
    }
    return null;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/no-image.svg';
  }
}
