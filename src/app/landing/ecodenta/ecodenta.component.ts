import { Component } from '@angular/core';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { Product } from '../../services/models/interfaces.model';
import { ProductService } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ecodenta',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './ecodenta.component.html',
  styleUrl: './ecodenta.component.css'
})
export class EcodentaComponent {
  products: Product[] = [];
  isLoading: boolean = true;
  error: string | null = null;


  highlight:any = {
    image:"assets/images/banner/ecodenta-landing-desk2.webp",
    imagemob:"assets/images/banner/ecodenta-landing-mob.webp",
    altimage:"ecodenta landing page banner",
    description:"امنحي ابتسامتك عناية فائقة مع معجون أسنان نباتي 100٪ يجمع بين الطبيعة والعناية الصحية لأسنان نظيفة وحماية تدوم.",
  }

  constructor(
    private productService: ProductService,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
  
        this.loadProductsByBrand();
    
  }

  private loadProductsByBrand(): void {
    this.productService.getProductsByBRAND("ecodenta").subscribe({
      next: (products: Product[]) => {
        this.products = products;
        if (products.length > 0 ) {
          this.updateSeoTags();
        } else {
          this.handleError('No products found in this category.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.handleError('Failed to load products. Please try again later.');
      }
    });
  }

  private updateSeoTags(): void {
    const title =  'Ecodenta';
    const description = `Explore products from the ecodenta.`;

    this.seoService.updatePageTitle(title);
    this.seoService.updateMetaTags(title, description);
  }

  addToCart(product: Product, quantity: number = 1): void {
  }

  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
  }
}
