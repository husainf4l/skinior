import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProductService } from '../../services/product.service';
import { Product, ProductImage } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-form-advanced',
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
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule,
    MatExpansionModule
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
                <p class="page-subtitle">{{ isEditMode ? 'Update product information' : 'Create a comprehensive product listing' }}</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Form -->
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <mat-tab-group class="form-tabs" [(selectedIndex)]="selectedTabIndex">
          
          <!-- Basic Information Tab -->
          <mat-tab label="Basic Info">
            <div class="tab-content">
              <mat-card class="form-section">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>info</mat-icon>
                    Product Details
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Product Title *</mat-label>
                      <input matInput formControlName="title" placeholder="Enter product title">
                      <mat-error *ngIf="productForm.get('title')?.hasError('required')">
                        Product title is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Product Title (Arabic)</mat-label>
                      <input matInput formControlName="titleAr" placeholder="أدخل عنوان المنتج">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>URL Slug</mat-label>
                      <input matInput formControlName="slug" placeholder="product-url-slug">
                      <mat-hint>Auto-generated from title if left empty</mat-hint>
                    </mat-form-field>
                  </div>

                  <div class="form-row two-columns">
                    <mat-form-field appearance="outline">
                      <mat-label>SKU</mat-label>
                      <input matInput formControlName="sku" placeholder="PROD-001">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Category</mat-label>
                      <mat-select formControlName="categoryId">
                        <mat-option value="face-care">Face Care</mat-option>
                        <mat-option value="body-care">Body Care</mat-option>
                        <mat-option value="hair-care">Hair Care</mat-option>
                        <mat-option value="sun-care">Sun Care</mat-option>
                        <mat-option value="makeup">Makeup</mat-option>
                        <mat-option value="fragrance">Fragrance</mat-option>
                        <mat-option value="supplements">Supplements</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Description (English) *</mat-label>
                      <textarea matInput formControlName="descriptionEn" rows="4" placeholder="Detailed product description"></textarea>
                      <mat-error *ngIf="productForm.get('descriptionEn')?.hasError('required')">
                        Description is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Description (Arabic)</mat-label>
                      <textarea matInput formControlName="descriptionAr" rows="4" placeholder="وصف تفصيلي للمنتج"></textarea>
                    </mat-form-field>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Pricing & Inventory Tab -->
          <mat-tab label="Pricing & Stock">
            <div class="tab-content">
              <mat-card class="form-section">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>attach_money</mat-icon>
                    Pricing Information
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-row two-columns">
                    <mat-form-field appearance="outline">
                      <mat-label>Price *</mat-label>
                      <input matInput type="number" formControlName="price" placeholder="0.00" step="0.01" min="0">
                      <span matPrefix>$&nbsp;</span>
                      <mat-error *ngIf="productForm.get('price')?.hasError('required')">Price is required</mat-error>
                      <mat-error *ngIf="productForm.get('price')?.hasError('min')">Price must be greater than 0</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Compare At Price</mat-label>
                      <input matInput type="number" formControlName="compareAtPrice" placeholder="0.00" step="0.01" min="0">
                      <span matPrefix>$&nbsp;</span>
                      <mat-hint>Original price for showing discounts</mat-hint>
                    </mat-form-field>
                  </div>

                  <div class="form-row two-columns">
                    <mat-form-field appearance="outline">
                      <mat-label>Currency</mat-label>
                      <mat-select formControlName="currency">
                        <mat-option value="USD">USD</mat-option>
                        <mat-option value="EUR">EUR</mat-option>
                        <mat-option value="SAR">SAR</mat-option>
                        <mat-option value="AED">AED</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Stock Quantity</mat-label>
                      <input matInput type="number" formControlName="stockQuantity" placeholder="0" min="0">
                    </mat-form-field>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Skincare Details Tab -->
          <mat-tab label="Skincare Info">
            <div class="tab-content">
              <mat-card class="form-section">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>face</mat-icon>
                    Skincare Specifications
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Active Ingredients</mat-label>
                      <textarea matInput formControlName="activeIngredients" rows="3" placeholder="List the key active ingredients"></textarea>
                    </mat-form-field>
                  </div>

                  <div class="form-row two-columns">
                    <mat-form-field appearance="outline">
                      <mat-label>Skin Type</mat-label>
                      <mat-select formControlName="skinType">
                        <mat-option value="all">All Skin Types</mat-option>
                        <mat-option value="dry">Dry</mat-option>
                        <mat-option value="oily">Oily</mat-option>
                        <mat-option value="combination">Combination</mat-option>
                        <mat-option value="sensitive">Sensitive</mat-option>
                        <mat-option value="normal">Normal</mat-option>
                        <mat-option value="acne-prone">Acne-Prone</mat-option>
                        <mat-option value="mature">Mature</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Usage Frequency</mat-label>
                      <mat-select formControlName="usage">
                        <mat-option value="daily-am">Daily (Morning)</mat-option>
                        <mat-option value="daily-pm">Daily (Evening)</mat-option>
                        <mat-option value="daily-both">Daily (AM & PM)</mat-option>
                        <mat-option value="weekly">Weekly</mat-option>
                        <mat-option value="as-needed">As Needed</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <!-- Dynamic Arrays -->
                  <div class="form-row">
                    <div class="array-field">
                      <h4>Skin Concerns</h4>
                      <div formArrayName="concerns">
                        <div *ngFor="let concern of concerns.controls; let i = index" class="array-item">
                          <mat-form-field appearance="outline">
                            <input matInput [formControlName]="i" placeholder="e.g., Acne, Wrinkles, Dark Spots">
                          </mat-form-field>
                          <button type="button" mat-icon-button color="warn" (click)="removeConcern(i)">
                            <mat-icon>remove</mat-icon>
                          </button>
                        </div>
                      </div>
                      <button type="button" mat-stroked-button (click)="addConcern()">
                        <mat-icon>add</mat-icon>
                        Add Concern
                      </button>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Images Tab -->
          <mat-tab label="Images">
            <div class="tab-content">
              <mat-card class="form-section">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>photo_library</mat-icon>
                    Product Images
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div formArrayName="images">
                    <div *ngFor="let image of images.controls; let i = index" [formGroupName]="i" class="image-form">
                      <div class="image-row">
                        <mat-form-field appearance="outline" class="image-url-field">
                          <mat-label>Image URL</mat-label>
                          <input matInput formControlName="url" placeholder="https://example.com/image.jpg">
                        </mat-form-field>
                        
                        <mat-form-field appearance="outline" class="alt-text-field">
                          <mat-label>Alt Text</mat-label>
                          <input matInput formControlName="altText" placeholder="Descriptive text">
                        </mat-form-field>

                        <div class="image-options">
                          <mat-slide-toggle formControlName="isMain" color="primary">Main</mat-slide-toggle>
                          <mat-slide-toggle formControlName="isHover" color="accent">Hover</mat-slide-toggle>
                        </div>

                        <button type="button" mat-icon-button color="warn" (click)="removeImage(i)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>

                      <div class="image-preview" *ngIf="image.get('url')?.value">
                        <img [src]="image.get('url')?.value" [alt]="image.get('altText')?.value" (error)="onImageError($event)">
                      </div>
                    </div>
                  </div>

                  <button type="button" mat-raised-button color="primary" (click)="addImage()">
                    <mat-icon>add_photo_alternate</mat-icon>
                    Add Image
                  </button>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Settings Tab -->
          <mat-tab label="Settings">
            <div class="tab-content">
              <mat-card class="form-section">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>settings</mat-icon>
                    Product Settings
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-row">
                    <div class="toggle-group">
                      <mat-slide-toggle formControlName="isActive" color="primary">
                        <span class="toggle-label">
                          <mat-icon>visibility</mat-icon>
                          Active Product
                        </span>
                      </mat-slide-toggle>
                      <p class="toggle-description">Product will be visible on the website</p>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="toggle-group">
                      <mat-slide-toggle formControlName="isFeatured" color="primary">
                        <span class="toggle-label">
                          <mat-icon>star</mat-icon>
                          Featured Product
                        </span>
                      </mat-slide-toggle>
                      <p class="toggle-description">Product will appear in featured sections</p>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="toggle-group">
                      <mat-slide-toggle formControlName="isNew" color="accent">
                        <span class="toggle-label">
                          <mat-icon>fiber_new</mat-icon>
                          New Product
                        </span>
                      </mat-slide-toggle>
                      <p class="toggle-description">Product will be marked as new</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- SEO Section -->
              <mat-card class="form-section">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>search</mat-icon>
                    SEO Settings
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Meta Title</mat-label>
                      <input matInput formControlName="metaTitle" placeholder="SEO optimized title">
                      <mat-hint>Recommended: 50-60 characters</mat-hint>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Meta Description</mat-label>
                      <textarea matInput formControlName="metaDescription" rows="3" placeholder="Brief description for search engines"></textarea>
                      <mat-hint>Recommended: 150-160 characters</mat-hint>
                    </mat-form-field>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>

        <!-- Action Buttons -->
        <mat-card class="actions-section">
          <mat-card-content>
            <div class="form-actions">
              <button type="button" mat-stroked-button color="primary" (click)="goBack()" class="action-button">
                <mat-icon>close</mat-icon>
                Cancel
              </button>
              
              <button type="button" mat-stroked-button color="accent" (click)="resetForm()" class="action-button" *ngIf="!isEditMode">
                <mat-icon>refresh</mat-icon>
                Reset
              </button>

              <button type="submit" mat-raised-button color="primary" [disabled]="productForm.invalid || saving" class="action-button primary">
                <mat-icon *ngIf="!saving">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
                <mat-icon *ngIf="saving" class="spinning">refresh</mat-icon>
                {{ saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>
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

    .form-tabs {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .tab-content {
      padding: 24px;
    }

    .form-section {
      margin-bottom: 24px;
      border-radius: 16px;
      overflow: hidden;
    }

    .form-section:last-child {
      margin-bottom: 0;
    }

    .form-section mat-card-header {
      background: #f8f9fa;
      padding: 16px 24px;
      border-bottom: 1px solid #e9ecef;
    }

    .form-section mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #495057;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .form-section mat-card-content {
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

    .toggle-group {
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

    .array-field h4 {
      margin: 0 0 16px 0;
      color: #495057;
      font-size: 1.1rem;
    }

    .array-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .array-item mat-form-field {
      flex: 1;
    }

    .image-form {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      background: #fafafa;
    }

    .image-row {
      display: grid;
      grid-template-columns: 2fr 1fr auto auto;
      gap: 16px;
      align-items: center;
      margin-bottom: 12px;
    }

    .image-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .image-preview {
      text-align: center;
    }

    .image-preview img {
      max-width: 200px;
      max-height: 150px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .actions-section {
      margin-top: 24px;
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

      .image-row {
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
export class ProductFormAdvancedComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: string | null = null;
  saving: boolean = false;
  selectedTabIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      titleAr: [''],
      slug: [''],
      descriptionEn: ['', [Validators.required, Validators.minLength(10)]],
      descriptionAr: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      compareAtPrice: [0],
      currency: ['USD'],
      sku: [''],
      isActive: [true],
      isFeatured: [false],
      isNew: [false],
      activeIngredients: [''],
      skinType: ['all'],
      usage: [''],
      stockQuantity: [0, [Validators.min(0)]],
      categoryId: [''],
      metaTitle: [''],
      metaDescription: [''],
      concerns: this.fb.array([]),
      images: this.fb.array([])
    });
  }

  get concerns(): FormArray {
    return this.productForm.get('concerns') as FormArray;
  }

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  addConcern() {
    this.concerns.push(this.fb.control(''));
  }

  removeConcern(index: number) {
    this.concerns.removeAt(index);
  }

  addImage() {
    const imageGroup = this.fb.group({
      url: ['', Validators.required],
      altText: [''],
      isMain: [false],
      isHover: [false],
      sortOrder: [0]
    });
    this.images.push(imageGroup);
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // Populate basic fields
        this.productForm.patchValue({
          title: product.title,
          titleAr: product.titleAr || '',
          slug: product.slug || '',
          descriptionEn: product.descriptionEn || '',
          descriptionAr: product.descriptionAr || '',
          price: product.price,
          compareAtPrice: product.compareAtPrice || 0,
          currency: product.currency || 'USD',
          sku: product.sku || '',
          isActive: product.isActive ?? true,
          isFeatured: product.isFeatured || false,
          isNew: product.isNew || false,
          activeIngredients: product.activeIngredients || '',
          skinType: product.skinType || 'all',
          usage: product.usage || '',
          stockQuantity: product.stockQuantity || 0,
          categoryId: product.categoryId || '',
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || ''
        });

        // Populate concerns array
        if (product.concerns) {
          let concernsArray: string[] = [];
          
          // Handle multiple formats from API
          if (Array.isArray(product.concerns)) {
            // If it's already an array, use it directly (backend preferred format)
            concernsArray = (product.concerns as string[]).filter((concern: string) => concern && concern.trim());
          } else if (typeof product.concerns === 'string') {
            try {
              // Try to parse as JSON first
              concernsArray = JSON.parse(product.concerns);
            } catch (e) {
              // If JSON parsing fails, treat as comma-separated string
              concernsArray = product.concerns.split(',').map(concern => concern.trim()).filter(concern => concern);
            }
          }
          
          concernsArray.forEach((concern: string) => {
            this.concerns.push(this.fb.control(concern));
          });
        }

        // Populate images array
        if (product.images) {
          product.images.forEach(image => {
            const imageGroup = this.fb.group({
              url: [image.url, Validators.required],
              altText: [image.altText || ''],
              isMain: [image.isMain || false],
              isHover: [image.isHover || false],
              sortOrder: [image.sortOrder || 0]
            });
            this.images.push(imageGroup);
          });
        }
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
      const formData = this.prepareFormData();

      const operation = this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, formData)
        : this.productService.createProduct(formData);

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

  prepareFormData() {
    const formValue = this.productForm.value;
    
    // Filter out empty concerns and keep as array (backend expects string[])
    const concernsArray = formValue.concerns.filter((concern: string) => concern.trim() !== '');
    const concerns = concernsArray.length > 0 ? concernsArray : undefined;
    
    // Filter out invalid images and prepare them for backend
    const images = formValue.images.filter((img: any) => img.url && img.url.trim() !== '').map((img: any) => ({
      url: img.url,
      altText: img.altText || '',
      isMain: img.isMain || false,
      isHover: img.isHover || false,
      sortOrder: img.sortOrder || 0
    }));

    return {
      ...formValue,
      concerns, // Array of strings like ["Large pores", "Oiliness"]
      images: images.length > 0 ? images : [] // Include images for updating
    };
  }

  resetForm() {
    this.productForm = this.createForm();
    this.selectedTabIndex = 0;
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  onImageError(event: any) {
    event.target.src = '/assets/images/no-image.svg';
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }
}
