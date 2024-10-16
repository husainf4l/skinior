import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../services/models/interfaces.model';
import { QuillModule } from 'ngx-quill';
import { quillModules } from '../../services/models/quill-config';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  imports: [CommonModule, FormsModule, QuillModule],
  standalone: true
})
export class ProductEditComponent implements OnInit {
  product!: Product;
  quillModules = quillModules;


  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct(Number(productId));
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(
      (product) => {
        this.product = product;

      },
      (error) => {
        console.error('Error loading product', error);
      }
    );
  }

  saveProduct() {
    // Call your service to update the product
    this.productService.updateProduct(this.product.id, this.product).subscribe(
      (response) => {
        console.log('Product updated successfully');
        this.router.navigate(['/admin/products']);
      },
      (error) => {
        console.error('Error updating product', error);
      }
    );
  }


}
