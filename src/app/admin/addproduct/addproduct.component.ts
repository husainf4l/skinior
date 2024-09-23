import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Category, Product } from '../../services/product.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddProductComponent {
  product: Partial<Product> = {
    images: [],
    categories: [],
    variants: [],
    relatedProducts: [],
    reviews: []
  }; // Partial product to handle optional fields
  categories: Category[] = [];
  selectedFiles: File[] = []; // To store selected image files

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories(); // Load categories for dropdown
  }

  // Load available categories from the service
  loadCategories(): void {
    this.productService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  // Handle file selection for images
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
    }
  }

  // Convert files into a form that can be sent to the backend (multipart/form-data)
  prepareImagesForUpload(): { url: string; altText?: string }[] {
    const images: { url: string; altText?: string }[] = [];
    for (const file of this.selectedFiles) {
      // Since you can't actually upload the file itself in the form directly like this in Angular,
      // handle uploading to your server and get the URL or save in formData to send directly.
      images.push({ url: file.name }); // Adjust to handle actual URL after upload
    }
    return images;
  }

  // Add product via the ProductService
  addProduct(): void {
    this.product.images = this.prepareImagesForUpload(); // Set prepared images
    this.productService.addProduct(this.product as Product).subscribe(() => {
      this.router.navigate(['/admin/products']);
    });
  }
}
