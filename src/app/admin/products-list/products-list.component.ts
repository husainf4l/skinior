import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Product, ProductList } from '../../services/models/interfaces.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProductsListComponent implements OnInit {

  products: ProductList[] = [];
  filteredProducts = [...this.products];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm: string = '';
  constructor(private productService: ProductService, private router: Router) { } // Inject Router

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
        this.filteredProducts = [...this.products]; // Start with all products
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredProducts.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  editProduct(id: number) {
    this.router.navigate(['admin/products/edit', id]);
  }
}
