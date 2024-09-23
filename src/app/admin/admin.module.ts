import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component'; // Standalone Component
import { ProductsListComponent } from './products-list/products-list.component'; // Standalone Component
import { ProductEditComponent } from './product-edit/product-edit.component'; // Standalone Component
import { BulkEditComponent } from './bulk-edit/bulk-edit.component'; // Standalone Component
import { AddProductComponent } from './addproduct/addproduct.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'products', component: ProductsListComponent },
      { path: 'products/edit/:id', component: ProductEditComponent },
      { path: 'products/bulk-edit', component: BulkEditComponent },
      { path: 'products/add-product', component: AddProductComponent },

    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashboardComponent,
    ProductsListComponent,
    ProductEditComponent,
    BulkEditComponent,
  ],
})
export class AdminModule { }
