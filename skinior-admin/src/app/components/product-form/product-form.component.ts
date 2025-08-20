import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="product-form-container">
      <!-- Header -->
      <mat-card class="header-card">
        <mat-card-content>
          <div class="header-content">
            <div class="title-section">
              <button mat-icon-button (click)="goBack()" class="back-button">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <div>
                <h1 class="page-title">
                  <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
                  {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
                </h1>
                <p class="page-subtitle">{{ isEditMode ? 'Update product information' : 'Fill in the details to create a new product' }}</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Form -->
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form-layout">
          <!-- Main Information -->
          <mat-card class="form-section">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>info</mat-icon>
                Basic Information
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Product Name *</mat-label>
                  <input 
                    matInput 
                    formControlName="name"
                    placeholder="Enter product name"
                  />
                  <mat-error *ngIf="productForm.get('name')?.hasError('required')">
                    Product name is required
                  </mat-error>
                  <mat-error *ngIf="productForm.get('name')?.hasError('minlength')">
                    Name must be at least 2 characters long
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description *</mat-label>
                  <textarea 
                    matInput 
                    formControlName="description"
                    placeholder="Enter product description"
                    rows="4"
                  ></textarea>
                  <mat-error *ngIf="productForm.get('description')?.hasError('required')">
                    Description is required
                  </mat-error>
                  <mat-error *ngIf="productForm.get('description')?.hasError('minlength')">
                    Description must be at least 10 characters long
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row two-columns">
                <mat-form-field appearance="outline">
                  <mat-label>Category *</mat-label>
                  <mat-select formControlName="categoryId">
                    <mat-option value="electronics">Electronics</mat-option>
                    <mat-option value="clothing">Clothing</mat-option>
                    <mat-option value="home-garden">Home & Garden</mat-option>
                    <mat-option value="sports">Sports</mat-option>
                    <mat-option value="books">Books</mat-option>
                    <mat-option value="beauty">Beauty</mat-option>
                    <mat-option value="food">Food & Beverages</mat-option>
                    <mat-option value="toys">Toys</mat-option>
                  </mat-select>
                  <mat-error *ngIf="productForm.get('categoryId')?.hasError('required')">
                    Category is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Image URL</mat-label>
                  <input 
                    matInput 
                    formControlName="imageUrl"
                    placeholder="https://example.com/image.jpg"
                  />
                  <mat-error *ngIf="productForm.get('imageUrl')?.hasError('pattern')">
                    Please enter a valid URL
                  </mat-error>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Pricing & Inventory -->
          <mat-card class="form-section">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>attach_money</mat-icon>
                Pricing & Inventory
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row two-columns">
                <mat-form-field appearance="outline">
                  <mat-label>Price *</mat-label>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <span matPrefix>$&nbsp;</span>
                  <mat-error *ngIf="productForm.get('price')?.hasError('required')">
                    Price is required
                  </mat-error>
                  <mat-error *ngIf="productForm.get('price')?.hasError('min')">
                    Price must be greater than 0
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Stock Quantity *</mat-label>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="stock"
                    placeholder="0"
                    min="0"
                  />
                  <mat-error *ngIf="productForm.get('stock')?.hasError('required')">
                    Stock quantity is required
                  </mat-error>
                  <mat-error *ngIf="productForm.get('stock')?.hasError('min')">
                    Stock cannot be negative
                  </mat-error>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Settings -->
          <mat-card class="form-section">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>settings</mat-icon>
                Product Settings
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <div class="toggle-field">
                  <mat-slide-toggle 
                    formControlName="featured"
                    color="primary">
                    <span class="toggle-label">
                      <mat-icon>star</mat-icon>
                      Featured Product
                    </span>
                  </mat-slide-toggle>
                  <p class="toggle-description">
                    Featured products will be highlighted and appear in special sections
                  </p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Preview Card -->
          <mat-card class="preview-section" *ngIf="productForm.value.name || productForm.value.price">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>preview</mat-icon>
                Preview
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="product-preview">
                <div class="preview-image">
                  <img 
                    [src]="productForm.value.imageUrl || '/assets/images/no-image.svg'"
                    [alt]="productForm.value.name || 'Product preview'"
                    (error)="onImageError($event)"
                  />
                  <div class="preview-badge" *ngIf="productForm.value.featured">
                    <mat-icon>star</mat-icon>
                    Featured
                  </div>
                </div>
                <div class="preview-content">
                  <h3>{{ productForm.value.name || 'Product Name' }}</h3>
                  <p class="preview-price">\${{ (productForm.value.price || 0) | number:'1.2-2' }}</p>
                  <p class="preview-description">{{ productForm.value.description || 'Product description will appear here...' }}</p>
                  <div class="preview-meta">
                    <span><mat-icon>category</mat-icon>{{ getCategoryName(productForm.value.categoryId) || 'Category' }}</span>
                    <span><mat-icon>inventory</mat-icon>{{ productForm.value.stock || 0 }} in stock</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Action Buttons -->
          <mat-card class="actions-section">
            <mat-card-content>
              <div class="form-actions">
                <button 
                  type="button"
                  mat-stroked-button 
                  color="primary"
                  (click)="goBack()"
                  class="action-button">
                  <mat-icon>close</mat-icon>
                  Cancel
                </button>
                
                <button 
                  type="button"
                  mat-stroked-button 
                  color="accent"
                  (click)="resetForm()"
                  class="action-button"
                  *ngIf="!isEditMode">
                  <mat-icon>refresh</mat-icon>
                  Reset
                </button>

                <button 
                  type="submit"
                  mat-raised-button 
                  color="primary"
                  [disabled]="productForm.invalid || saving"
                  class="action-button primary">
                  <mat-icon *ngIf="!saving">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
                  <mat-icon *ngIf="saving" class="spinning">refresh</mat-icon>
                  {{ saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .product-form-container {
      padding: 24px;
      background: #fafafa;
      min-height: 100vh;
    }

    .header-card {
      margin-bottom: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .header-content {
      display: flex;
      align-items: center;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-button {
      color: white !important;
    }

    .page-title {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .page-subtitle {
      margin: 8px 0 0 0;
      opacity: 0.9;
      font-size: 1rem;
    }

    .form-layout {
      display: grid;
      gap: 24px;
    }

    .form-section, .preview-section, .actions-section {
      border-radius: 16px;
      overflow: hidden;
    }

    .form-section mat-card-header,
    .preview-section mat-card-header {
      background: #f8f9fa;
      padding: 16px 24px;
      border-bottom: 1px solid #e9ecef;
    }

    .form-section mat-card-title,
    .preview-section mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #495057;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .form-section mat-card-content,
    .preview-section mat-card-content,
    .actions-section mat-card-content {
      padding: 24px;
    }

    .form-row {
      margin-bottom: 16px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .toggle-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .toggle-description {
      margin: 0;
      font-size: 0.9rem;
      color: #6c757d;
      margin-left: 48px;
    }

    .product-preview {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 24px;
      align-items: start;
    }

    .preview-image {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: #f8f9fa;
    }

    .preview-image img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .preview-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #ffd700;
      color: #333;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .preview-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .preview-content h3 {
      margin: 0 0 8px 0;
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
    }

    .preview-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2e7d32;
      margin: 0 0 12px 0;
    }

    .preview-description {
      color: #666;
      line-height: 1.5;
      margin: 0 0 16px 0;
    }

    .preview-meta {
      display: flex;
      gap: 16px;
    }

    .preview-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #777;
      font-size: 0.9rem;
    }

    .preview-meta mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
    }

    .action-button {
      min-width: 140px;
      height: 48px;
      border-radius: 24px;
      font-weight: 600;
    }

    .action-button.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .product-form-container {
        padding: 16px;
      }

      .two-columns {
        grid-template-columns: 1fr;
      }

      .product-preview {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .action-button {
        width: 100%;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: string | null = null;
  saving: boolean = false;

  private categories = {
    'electronics': 'Electronics',
    'clothing': 'Clothing',
    'home-garden': 'Home & Garden',
    'sports': 'Sports',
    'books': 'Books',
    'beauty': 'Beauty',
    'food': 'Food & Beverages',
    'toys': 'Toys'
  };

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      imageUrl: ['', [Validators.pattern(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      featured: [false]
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.title,
          description: product.descriptionEn || '',
          price: product.price,
          categoryId: product.categoryId || '',
          imageUrl: this.getMainImage(product) || '',
          stock: product.stockQuantity || 0,
          featured: product.isFeatured || false
        });
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Failed to load product', 'Close', { duration: 3000 });
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.saving = true;
      const formData = this.productForm.value;

      // Transform the form data to match the API expected format
      const productData = {
        title: formData.name,
        descriptionEn: formData.description,
        price: formData.price,
        categoryId: formData.categoryId,
        stockQuantity: formData.stock,
        isFeatured: formData.featured,
        isActive: true,
        // Add image if provided
        images: formData.imageUrl ? [{
          url: formData.imageUrl,
          isMain: true,
          altText: formData.name
        }] : []
      };

      const operation = this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, productData)
        : this.productService.createProduct(productData);

      operation.subscribe({
        next: (product) => {
          this.saving = false;
          const message = this.isEditMode ? 'Product updated successfully!' : 'Product created successfully!';
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.saving = false;
          console.error('Error saving product:', error);
          const message = this.isEditMode ? 'Failed to update product' : 'Failed to create product';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm() {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      imageUrl: '',
      stock: 0,
      featured: false
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  getCategoryName(categoryId: string): string {
    return this.categories[categoryId as keyof typeof this.categories] || categoryId;
  }

  onImageError(event: any) {
    event.target.src = '/assets/images/no-image.svg';
  }

  getMainImage(product: any): string | null {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find((img: any) => img.isMain);
      return mainImage?.url || product.images[0].url;
    }
    return null;
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }
}
