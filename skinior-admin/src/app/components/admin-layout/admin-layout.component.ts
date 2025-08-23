import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <mat-sidenav-container class="admin-container">
      <!-- Sidebar -->
      <mat-sidenav #sidenav mode="side" opened class="admin-sidenav">
        <div class="sidenav-header">
          <div class="logo">
            <span class="logo-icon">🧴</span>
            <h2>Skinior Admin</h2>
          </div>
        </div>

        <mat-nav-list class="nav-list">
          <a mat-list-item 
             routerLink="/dashboard" 
             [class.active]="currentRoute === '/dashboard'"
             class="nav-item">
            <mat-icon matListIcon>dashboard</mat-icon>
            <span matLine>Dashboard</span>
          </a>

          <a mat-list-item 
             routerLink="/users" 
             [class.active]="currentRoute.startsWith('/users')"
             class="nav-item">
            <mat-icon matListIcon>people</mat-icon>
            <span matLine>Users</span>
          </a>

          <a mat-list-item 
             routerLink="/products" 
             [class.active]="currentRoute.startsWith('/products') && !currentRoute.includes('/import')"
             class="nav-item">
            <mat-icon matListIcon>inventory_2</mat-icon>
            <span matLine>Products</span>
          </a>

          <a mat-list-item 
             routerLink="/products/import" 
             [class.active]="currentRoute.startsWith('/products/import')"
             class="nav-item nav-subitem">
            <mat-icon matListIcon>cloud_upload</mat-icon>
            <span matLine>Import Products</span>
          </a>

          <a mat-list-item 
             routerLink="/orders" 
             [class.active]="currentRoute.startsWith('/orders')"
             class="nav-item">
            <mat-icon matListIcon>receipt_long</mat-icon>
            <span matLine>Orders</span>
          </a>

          <a mat-list-item 
             routerLink="/analytics" 
             [class.active]="currentRoute.startsWith('/analytics')"
             class="nav-item">
            <mat-icon matListIcon>analytics</mat-icon>
            <span matLine>Analytics</span>
          </a>

          <div class="nav-divider"></div>

          <a mat-list-item 
             routerLink="/settings" 
             [class.active]="currentRoute.startsWith('/settings')"
             class="nav-item">
            <mat-icon matListIcon>settings</mat-icon>
            <span matLine>Settings</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content class="admin-content">
        <!-- Top toolbar -->
        <mat-toolbar class="admin-toolbar">
          <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>

          <span class="toolbar-spacer"></span>

          <!-- User menu -->
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-button">
            <mat-icon>account_circle</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu" class="user-menu">
            <div class="user-info">
              <p class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
              <p class="user-email">{{ currentUser?.email }}</p>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Page content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .admin-container {
      height: 100vh;
    }

    .admin-sidenav {
      width: 280px;
      background: #ffffff;
      color: #1d1d1f;
      border-right: 1px solid #e5e5e7;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
    }

    .sidenav-header {
      padding: 24px 20px;
      background: #fbfbfd;
      border-bottom: 1px solid #e5e5e7;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 28px;
      background: linear-gradient(135deg, #007AFF, #5856D6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1d1d1f;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
    }

    .nav-list {
      padding: 12px 0;
    }

    .nav-item {
      color: #424245 !important;
      border-radius: 10px !important;
      margin: 2px 12px !important;
      transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      font-weight: 500 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif !important;
    }

    .nav-item:hover {
      background: #f5f5f7 !important;
      color: #1d1d1f !important;
      transform: translateX(2px);
    }

    .nav-item.active {
      background: #007AFF !important;
      color: white !important;
      box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
    }

    .nav-item.active:hover {
      background: #0056CC !important;
      transform: translateX(2px);
    }

    .nav-item mat-icon {
      color: inherit;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-item.active mat-icon {
      color: white;
    }

    .nav-subitem {
      margin-left: 24px !important;
      padding-left: 32px !important;
      font-size: 0.9em !important;
      opacity: 0.8;
    }

    .nav-subitem mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
    }

    .nav-divider {
      height: 1px;
      background: #e5e5e7;
      margin: 12px 20px;
      opacity: 0.6;
    }

    .admin-toolbar {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: #1d1d1f;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 10;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    }

    .menu-button {
      color: #007AFF !important;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .user-button {
      margin-left: 8px;
      color: #424245 !important;
      transition: all 0.2s ease;
    }

    .user-button:hover {
      background: rgba(0, 0, 0, 0.04) !important;
      color: #007AFF !important;
    }

    .user-menu {
      min-width: 240px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .user-info {
      padding: 16px 20px;
      background: #fbfbfd;
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid #e5e5e7;
    }

    .user-name {
      margin: 0 0 4px 0;
      font-weight: 600;
      color: #1d1d1f;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    }

    .user-email {
      margin: 0;
      font-size: 13px;
      color: #8e8e93;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    }

    .page-content {
      padding: 24px;
      background: #fbfbfd;
      min-height: calc(100vh - 64px);
    }

    @media (max-width: 768px) {
      .admin-sidenav {
        width: 100%;
      }
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  currentRoute = '';
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    // Set initial route
    this.currentRoute = this.router.url;
    
    // Track current route for active nav highlighting
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });

    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}