import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-shop-all',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
  ],
  templateUrl: './shop-all.component.html',
  styleUrl: './shop-all.component.css'
})
export class ShopAllComponent {
  products: Product[] = [];
  categories: any[] = [];
  search: string = '';
  page: number = 1;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }



  loadProducts() {
    const selectedCategories = this.categories
      .filter((cat) => cat.selected)
      .map((cat) => cat.id);

    const params = {
      search: this.search,
      page: this.page,
    };

    this.productService.getProducts(params).subscribe((data) => {
      this.products = data;
    });
  }
}
