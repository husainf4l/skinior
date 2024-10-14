import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/models/product.model';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent {
  featuredProducts: Product[] = [
    {
      id: 1,
      brand: "Coverderm",
      name: "Perfect Face",
      price: 32,
      images: [
        {
          id: "img1",
          url: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
          altText: "Coverderm Perfect Face product image"
        }
      ],
      category: {
        id: 0,
        name: ''
      },
      barcode: "123456789",
      isFeatured: true
    },
    {
      id: 1,
      brand: "Coverderm",
      name: "Perfect Face",
      price: 32,
      images: [
        {
          id: "img1",
          url: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
          altText: "Coverderm Perfect Face product image"
        }
      ],
      category: {
        id: 0,
        name: ''
      },
      barcode: "123456789",
      isFeatured: true
    }, {
      id: 1,
      brand: "Coverderm",
      name: "Perfect Face",
      price: 32,
      images: [
        {
          id: "img1",
          url: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
          altText: "Coverderm Perfect Face product image"
        }
      ],
      category: {
        id: 0,
        name: ''
      },
      barcode: "123456789",
      isFeatured: true
    }, {
      id: 1,
      brand: "Coverderm",
      name: "Perfect Face",
      price: 32,
      images: [
        {
          id: "img1",
          url: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
          altText: "Coverderm Perfect Face product image"
        }
      ],
      category: {
        id: 0,
        name: ''
      },
      barcode: "123456789",
      isFeatured: true
    },

  ];

}
