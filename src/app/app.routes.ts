import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ShopCategoryComponent } from './components/shop-category/shop-category.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'shop/category/:categoryId', component: ProductListComponent },
    { path: 'shop/product/:id', component: ProductDetailsComponent },
    { path: 'shop', component: ShopCategoryComponent },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminRoutingModule) },

    { path: '**', component: NotFoundComponent }

];
