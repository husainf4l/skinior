import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopAllComponent } from './pages/shop-all/shop-all.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';

export const routes: Routes = [
    {
        path: "", component: HomeComponent

    },
    { path: 'shop-all', component: ShopAllComponent },
    { path: 'product/:id', component: ProductPageComponent },

    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

];
