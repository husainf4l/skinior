import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Login route
  { 
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },
  
  // Admin routes (protected)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    children: [
      { 
        path: '', 
        redirectTo: '/dashboard', 
        pathMatch: 'full' 
      },
      { 
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      { 
        path: 'users',
        loadComponent: () => import('./components/users/users.component')
          .then(m => m.UsersComponent)
      },
      { 
        path: 'products', 
        loadComponent: () => import('./components/product-list/product-list.component')
          .then(m => m.ProductListComponent) 
      },
      { 
        path: 'products/add', 
        loadComponent: () => import('./components/product-form-advanced/product-form-advanced.component')
          .then(m => m.ProductFormAdvancedComponent) 
      },
      { 
        path: 'products/edit/:id', 
        loadComponent: () => import('./components/product-form-advanced/product-form-advanced.component')
          .then(m => m.ProductFormAdvancedComponent) 
      },
      { 
        path: 'products/import', 
        loadComponent: () => import('./components/product-import/product-import.component')
          .then(m => m.ProductImportComponent) 
      },
      { 
        path: 'orders',
        loadComponent: () => import('./components/orders/orders.component')
          .then(m => m.OrdersComponent)
      },
      { 
        path: 'analytics',
        loadComponent: () => import('./components/analytics/analytics.component')
          .then(m => m.AnalyticsComponent)
      },
      { 
        path: 'settings',
        loadComponent: () => import('./components/settings/settings.component')
          .then(m => m.SettingsComponent)
      }
    ]
  },
  
  // Redirect to login for invalid routes
  { path: '**', redirectTo: '/login' }
];
