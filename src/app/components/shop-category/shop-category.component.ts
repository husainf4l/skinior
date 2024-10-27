import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../services/models/interfaces.model';

@Component({
  selector: 'app-shop-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-category.component.html',
  styleUrl: './shop-category.component.css'
})
export class ShopCategoryComponent {
  categories: Category[] = [
    {
      id: 1,
      name: "التخفيضات",
      image: "assets/images/category/sale.webp",
      description: "",
      products: []
    },
    {
      id: 1,
      name: "منتجاتنا",
      image: "assets/images/category/margo.webp",
      description: "",
      products: []
    },
    {
      id: 6,
      name: "العطور",
      image: "assets/images/category/fragrance.webp",
      description: "",
      products: []
    },

    {
      id: 2,
      name: "العناية بالبشرة",
      image: "assets/images/category/skincare.webp",
      description: "",
      products: []
    },
    {
      id: 4,
      name: "المكياج",
      image: "assets/images/category/makeup.webp",
      description: "",
      products: []
    },
    {
      id: 1,
      name: "الشعر",
      image: "assets/images/category/haircare.webp",
      description: "",
      products: []
    },
    {
      id: 3,
      name: "العناية بالفم",
      image: "assets/images/category/oralcare.webp",
      description: "",
      products: []
    },
    {
      id: 1,
      name: "Margo Group",
      image: "assets/images/category/margo.webp",
      description: "",
      products: []
    },

  ]

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/category/margo.webp';
  }
  

}
