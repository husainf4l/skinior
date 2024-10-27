import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ShopCategoryComponent } from './components/shop-category/shop-category.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Skinior - Premium Beauty Products',
      description: 'Discover Skinior’s collection of premium beauty and skincare products.',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login - Skinior',
      description: 'Log in to your Skinior account and start shopping for premium beauty products.',
    },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'Signup - Skinior',
      description: 'Create a new Skinior account and explore our latest beauty offerings.',
    },
  },
  {
    path: 'shop/category/:categoryId',
    component: ProductListComponent,
    data: {
      title: 'Category - Skinior',
      description: 'Browse Skinior’s products by category to find the perfect beauty solution.',
    },
  },
  {
    path: 'shop/product/:id',
    component: ProductDetailsComponent,
    data: {
      title: 'Product Details - Skinior',
      description: 'View product details and features of our top beauty items.',
    },
  },
  {
    path: 'shop',
    component: ShopCategoryComponent,
    data: {
      title: 'Shop Categories - Skinior',
      description: 'Explore all product categories at Skinior.',
    },
  },
  {
    path: 'cart',
    component: CartComponent,
    data: {
      title: 'Cart - Skinior',
      description: 'Review your selected items in your cart before checkout.',
    },
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    data: {
      title: 'Checkout - Skinior',
      description: 'Complete your purchase securely on Skinior.',
    },
  },
  {
    path: 'order-confirmation',
    component: OrderConfirmationComponent,
    data: {
      title: 'Order Confirmation - Skinior',
      description: 'Thank you for your order! Your purchase has been successfully confirmed.',
    },
  },
  {
    path: 'blog/:id',
    component: BlogDetailsComponent,
    data: {
      title: 'Blog - Skinior',
      description: 'Stay updated with the latest news and trends from the Skinior blog.',
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      title: '404 - Page Not Found',
      description: 'Oops! The page you are looking for does not exist.',
    },
  },
];
