import { Component } from '@angular/core';
import { Category } from '../../services/models/category.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-showcase.component.html',
  styleUrl: './categories-showcase.component.css'
})
export class CategoriesShowcaseComponent {

  categories: Category[] = [
    {
      id: 3,
      name: "Oral Care",
      imageUrl: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
      description: ""
    },
    {
      id: 3,
      name: "Oral Care",
      imageUrl: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
      description: ""
    },
    {
      id: 3,
      name: "Oral Care",
      imageUrl: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
      description: ""
    },
    {
      id: 3,
      name: "Oral Care",
      imageUrl: "https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600",
      description: ""
    },

  ]
}
