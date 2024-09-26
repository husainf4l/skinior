import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartOrderService } from '../../services/cart-order.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  totalQuantity: number = 0;

  constructor(public authService: AuthService, private router: Router, private cartOrderService: CartOrderService) {
    // Use an effect to reactively get the cart quantity
    effect(() => {
      this.totalQuantity = this.cartOrderService.totalQuantity();
    });
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
