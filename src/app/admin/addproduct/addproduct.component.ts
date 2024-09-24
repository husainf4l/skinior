import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../services/models/product.model';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddProductComponent implements OnInit {
  product: Product = {
    name: '',
    description: '',
    price: 0,
    categoryId: 1, 
    barcode: '',
    brand: '',
    isFeatured: false,
  };

  categories: any[] = [];
  selectedFiles: File[] = [];
  selectedCategoryId: any;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }



  addProduct(): void {
    // Construct the product object directly without FormData
    const productData = {
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      categoryId: 3, // Manually setting category ID to 3 as per your request
      barcode: this.product.barcode,
      brand: this.product.brand,
      isFeatured: this.product.isFeatured
    };
  
    console.log(productData)
    // Make HTTP POST request with the JSON payload
    this.productService.addProduct(productData).subscribe(() => {
      this.router.navigate(['']);
    });
  }
  
}
