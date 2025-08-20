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
  templateUrl: './product-form-advanced.component.html',
  styleUrl: './product-form-advanced.component.css'
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
