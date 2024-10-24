import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, computed, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationLink } from '../../services/models/general.model';
import { CartService } from '../../services/cart.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;

  totalQuantity = computed(() => this.cartService.cartCount());

  navigationLinks: NavigationLink[] = [
    { id: 0, name: 'الرئيسية', routerLink: '/', lang: 'ar' },
    { id: 6, name: 'العطور', routerLink: '/shop/category/6', lang: 'ar' },
    { id: 4, name: 'المكياج', routerLink: '/shop/category/4', lang: 'ar' },
    { id: 1, name: 'الشعر', routerLink: '/shop/category/1', lang: 'ar' },
    { id: 2, name: 'العناية بالوجه', routerLink: '/shop/category/2', lang: 'ar' },
    { id: 5, name: 'الاستحمام والجسم', routerLink: '/shop/category/5', lang: 'ar' },
    { id: 3, name: 'العناية بالفم', routerLink: '/shop/category/3', lang: 'ar' },
    { id: 1, name: 'الأكثر مبيعًا', routerLink: '/shop/category/1', lang: 'ar' },
    { id: 1, name: 'منتجات جديدة', routerLink: '/shop/category/1', lang: 'ar' }
  ];

  mainLogo: string = 'assets/logo/logoblack.png';

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    effect(() => {
      console.log('Cart updated:', this.totalQuantity());
    });
  }


  ngOnInit(): void {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('sessionId', sessionId);
    }

    this.cartService.getCartBySessionId(sessionId).subscribe(
      () => console.log('Cart loaded successfully.'),
      (error) => console.error('Error loading cart:', error)
    );
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
