import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/models/interfaces.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'], 
  standalone:true,
  imports:[RouterLink, CommonModule]
})
export class ProductCardComponent {
  @Input() product!: Product ;

  addToCart(product: Product) {
    console.log(`Added ${product.name} to the cart.`);
    // Implement the logic to add the product to the cart
  }
}
