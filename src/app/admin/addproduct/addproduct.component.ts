// src/app/pages/addproduct/addproduct.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, NewProduct } from '../../services/models/interfaces.model';
import { quillModules } from '../../services/models/quill-config';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule]
})
export class AddProductComponent implements OnInit {
  quillModules = quillModules;

  product: NewProduct = {
    name: '',
    description: '',
    price: 0,
    categoryId: 1,
    barcode: '',
    brand: '',
    isFeatured: false,
  };

  categories: Category[] = []; // Use Category interface
  selectedFiles: File[] = [];
  selectedCategoryId: number = 1; // Ensure correct type

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe((data: Category[]) => { // Type annotation
      this.categories = data;
    });
  }

  addProduct(): void {
    // Validate the product data before sending
    if (!this.product.name || !this.product.price || !this.product.categoryId) {
      alert('Please fill in all required fields.');
      return;
    }

    // Log the product data for debugging
    console.log('Adding Product:', this.product);

    // Make HTTP POST request with the JSON payload
    this.productService.addProduct(this.product).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        this.router.navigate(['']); // Navigate to home or another page
      },
      error: (error) => {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again later.');
      }
    });
  }


}
