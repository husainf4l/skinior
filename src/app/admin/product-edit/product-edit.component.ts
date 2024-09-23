import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductEditComponent implements OnInit {
  product: Product = {
    id: 0,
    name: '',
    price: 0,
    stock: 0,
    description: '',
    sku: '',
    slug: '',
    brand: '',
    isFeatured: false,
    isTopLine: false,
    images: [],
    categories: [],
    attributes: [],
    variants: [],
    reviews: [],
    relatedProducts: []
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe((data: Product) => {
        this.product = data;
      });
    }
  }

  saveProduct(): void {
    if (this.product) {
      this.productService.updateProduct(this.product.id, this.product).subscribe(() => {
        this.router.navigate(['/admin/products']);
      });
    }
  }
}
