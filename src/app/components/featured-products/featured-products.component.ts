import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/models/interfaces.model';
import Decimal from 'decimal.js';


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
      categoryId: 0,

      price: 32,
      images: [
        {
          id: 4,
          url: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
          altText: "Coverderm Perfect Face product image"
        }
      ],
      category: {
        id: 0,
        name: '',
        images: [],
        products: []
      },
      barcode: "123456789",
      isFeatured: true,
      tags: [],
      reviews: [],
      orderItems: [],
      cartItems: [],
      wishlistItems: [],
      variants: [],
      relatedProducts: [],
      relatedBy: [],
      createdAt: undefined,
      updatedAt: undefined
    },
    {
      id: 1,
      brand: "Coverderm",
      name: "Perfect Face",
      price: 34,
      categoryId: 0,
      images: [
        {
          id: 4,
          url: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
          altText: "Coverderm Perfect Face product image"
        }
      ],
      category: {
        id: 0,
        name: '',
        images: [],
        products: []
      },

      barcode: "123456789",
      isFeatured: true,
      tags: [],
      reviews: [],
      orderItems: [],
      cartItems: [],
      wishlistItems: [],
      variants: [],
      relatedProducts: [],
      relatedBy: [],
      createdAt: undefined,
      updatedAt: undefined
    }, {
      id: 1,
      brand: "Coverderm",
      name: "Perfect Face",
      price: 34,
      categoryId: 0,

      images: [
        {
          id: 4,
          url: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
          altText: "Coverderm Perfect Face product image"
        }
      ],
      category: {
        id: 0,
        name: '',
        images: [],
        products: []
      },
      barcode: "123456789",
      isFeatured: true,
      tags: [],
      reviews: [],
      orderItems: [],
      cartItems: [],
      wishlistItems: [],
      variants: [],
      relatedProducts: [],
      relatedBy: [],
    }, {
      id: 1,
      categoryId: 0,

      brand: "Coverderm",
      name: "Perfect Face",
      price: 43,
      images: [
        {
          id: 4,
          url: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
          altText: "Coverderm Perfect Face product image"
        }
      ],
      category: {
        id: 0,
        name: '',
        images: [],
        products: []
      },
      barcode: "123456789",
      isFeatured: true
    },

  ];

}
