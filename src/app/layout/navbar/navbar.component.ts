import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartOrderService } from '../../services/cart-order.service';
import { CommonModule } from '@angular/common';
import { NavigationLink } from '../../services/models/general.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  isMenuOpen = false;
  totalQuantity;

  navigationLinks: NavigationLink[] = [
    { id: 0, name: 'الرئيسية', routerLink: '/', lang: 'ar' },
    { id: 1, name: 'العطور', routerLink: '/shop/category/1', lang: 'ar' },
    { id: 2, name: 'المكياج', routerLink: '/shop/category/2', lang: 'ar' },
    { id: 3, name: 'الشعر', routerLink: '/shop/category/3', lang: 'ar' },
    { id: 4, name: 'العناية بالوجه', routerLink: '/shop/category/4', lang: 'ar' },
    { id: 5, name: 'الاستحمام والجسم', routerLink: '/shop/category/5', lang: 'ar' },
    { id: 6, name: 'العناية بالفم', routerLink: '/shop/category/6', lang: 'ar' },
    { id: 7, name: 'الأكثر مبيعًا', routerLink: '/shop/category/7', lang: 'ar' },
    { id: 8, name: 'منتجات جديدة', routerLink: '/shop/category/8', lang: 'ar' }
  ];

  mainLogo: string = 'assets/logo/logoblack.png';

  constructor(
    private router: Router,
    public authService: AuthService,
    private cartOrderService: CartOrderService
  ) {
    this.totalQuantity = this.cartOrderService.totalQuantity;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
