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
      name: "التخفيضات",
      image: "assets/images/category/sale.webp",
      description: "",
      products: [],
      handle:"fragrance"

    },
    {
      id: 1,
      name: "منتجاتنا",
      image: "assets/images/category/margo.webp",
      description: "",
      products: [],
      handle:"fragrance"

    },
    {
      id: 6,
      name: "العطور",
      image: "assets/images/category/fragrance.webp",
      description: "",
      products: [],
      handle:"fragrance"

    },

    {
      id: 2,
      name: "العناية بالبشرة",
      image: "assets/images/category/skincare.webp",
      description: "",
      products: [],
      handle:"skincare"

    },
    {
      id: 4,
      name: "المكياج",
      image: "assets/images/category/makeup.webp",
      description: "",
      products: [],
      handle:"make-up"

    },
    {
      id: 1,
      name: "الشعر",
      image: "assets/images/category/haircare.webp",
      description: "",
      products: [],
      handle:"hair-care"

    },
    {
      id: 3,
      name: "العناية بالفم",
      image: "assets/images/category/oralcare.webp",
      description: "",
      products: [],
      handle:"oral-care"

    },
    {
      id: 1,
      name: "Margo Group",
      image: "assets/images/category/margo.webp",
      description: "",
      products: [],
      handle:"hair-care"
    },

  ]

}
