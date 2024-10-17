import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../services/models/interfaces.model';

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
      id: 1,
      name: "العطور",
      image: "assets/images/1.png",
      description: "",
      products: []
    },

    {
      id: 3,
      name: "العناية بالبشرة",
      image: "assets/images/1.png",
      description: "",
      products: []
    },
    {
      id: 3,
      name: "المكياج",
      image: "assets/images/1.png",
      description: "",
      products: []
    },
    {
      id: 3,
      name: "الشعر",
      image: "assets/images/category/haircare.jpg",
      description: "",
      products: []
    },
    {
      id: 3,
      name: "العناية بالفم",
      image: "assets/images/category/oralcare.jpg",
      description: "",
      products: []
    },
    {
      id: 3,
      name: "العناية بالجسم",
      image: "assets/images/1.png",
      description: "",
      products: []
    },
  ]




}
