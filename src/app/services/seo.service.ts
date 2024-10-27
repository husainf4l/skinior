import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private meta: Meta, private titleService: Title) { }

  /** 
   * Updates the page title. 
   * If no title is provided, falls back to a default value.
   */
  updatePageTitle(title: string = 'Default Page Title'): void {
    this.titleService.setTitle(title);
  }

  /** 
   * Updates or creates meta tags for SEO and social sharing. 
   */
  updateMetaTags(
    title: string,
    description: string,
    keywords: string = 'default, keywords',
    image: string = 'default-image-url.jpg',
    availability: string = 'In Stock',
    discount?: number
  ): void {
    const url = window.location.href;

    this.updateOrCreateTag('name', 'description', description);
    this.updateOrCreateTag('name', 'keywords', keywords);

    // Open Graph meta tags
    this.updateOrCreateTag('property', 'og:title', title);
    this.updateOrCreateTag('property', 'og:description', description);
    this.updateOrCreateTag('property', 'og:image', image);
    this.updateOrCreateTag('property', 'og:url', url);
    this.updateOrCreateTag('property', 'og:type', 'product');

    // Availability and discount meta tags
    this.updateOrCreateTag('name', 'availability', availability);
    if (discount) {
      this.updateOrCreateTag('name', 'discount', `${discount}% off`);
    }
  }

  /**
   * Adds structured data to the page using JSON-LD.
   * Useful for SEO and Google rich results.
   */
  addStructuredData(product: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.image,
      description: product.description,
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.discountedPrice || product.price,
        availability: product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    });
    document.head.appendChild(script);
  }

  /**
   * Helper method to update or create meta tags.
   * Prevents duplicate tags and ensures the latest content is applied.
   */
  private updateOrCreateTag(attr: 'name' | 'property', attrValue: string, content: string): void {
    const tag = this.meta.getTag(`${attr}="${attrValue}"`);

    if (tag) {
      this.meta.updateTag({ [attr]: attrValue, content });
    } else {
      this.meta.addTag({ [attr]: attrValue, content });
    }
  }
}
