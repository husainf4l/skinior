import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-category.component.html',
  styleUrl: './shop-category.component.css'
})
export class ShopCategoryComponent implements OnInit {
  categories: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
}
