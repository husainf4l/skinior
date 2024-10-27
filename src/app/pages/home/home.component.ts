import { Component } from '@angular/core';
import { HeroComponent } from "../../components/hero/hero.component";
import { CategoriesShowcaseComponent } from "../../components/categories-showcase/categories-showcase.component";
import { PromotionsComponent } from "../../components/promotions/promotions.component";
import { CustomerReviewsComponent } from "../../components/customer-reviews/customer-reviews.component";
import { CtaBannerComponent } from "../../components/cta-banner/cta-banner.component";
import { BlogTeaserComponent } from "../../components/blog-teaser/blog-teaser.component";
import { ProductShowcaseComponent } from "../../components/product-showcase/product-showcase.component";
import { CommonModule } from '@angular/common';
import { BrandsShowcaseComponent } from "../../components/brands-showcase/brands-showcase.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CategoriesShowcaseComponent, PromotionsComponent, CustomerReviewsComponent, CtaBannerComponent, BlogTeaserComponent, ProductShowcaseComponent, CommonModule, BrandsShowcaseComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  productShowcases = [
    { categoryHandle: "hair-care", title: 'المنتجات المميزة' },
    { categoryHandle: 'skincare', title: 'أفضل منتجات العناية بالبشرة' },
    { categoryHandle: "hair-care", title: 'أفضل منتجات العناية بالشعر' },
    { categoryHandle: "hair-care", title: 'المنتجات الجديدة' },
    { categoryHandle: "hair-care", title: 'الأكثر مبيعاً' },
    { categoryHandle: "hair-care", title: 'أفضل منتجات العناية بالجسم' },
  ];


}
