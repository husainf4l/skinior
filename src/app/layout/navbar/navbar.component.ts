import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, computed, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationLink } from '../../services/models/general.model';
import { CartService } from '../../services/cart.service';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule, NgModel } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/models/interfaces.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService
  ) {
    effect(() => {
      console.log('Cart updated:', this.totalQuantity());
    });
  }
  isMenuOpen = false;
  products: Product[] = [];






  totalQuantity = computed(() => this.cartService.cartCount());

  navigationLinks: NavigationLink[] = [
    { id: 0, name: 'الرئيسية', routerLink: '/', lang: 'ar' },
    { id: 6, name: 'العطور', routerLink: '/shop/category/fragrance', lang: 'ar' },
    { id: 4, name: 'المكياج', routerLink: '/shop/category/make-up', lang: 'ar' },
    { id: 1, name: 'الشعر', routerLink: '/shop/category/hair-care', lang: 'ar' },
    { id: 2, name: 'العناية بالوجه', routerLink: '/shop/category/skincare', lang: 'ar' },
    { id: 5, name: 'الاستحمام والجسم', routerLink: '/shop/category/body-care', lang: 'ar' },
    { id: 3, name: 'العناية بالفم', routerLink: '/shop/category/oral-care', lang: 'ar' },

  ];

  mainLogo: string = 'assets/logo/skinior-logo-ar.webp';




  ngOnInit(): void {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('sessionId', sessionId);
    }


  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
