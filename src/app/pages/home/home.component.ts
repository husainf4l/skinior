import { Component } from '@angular/core';
import { HeroComponent } from "../../components/hero/hero.component";
import { CategoriesShowcaseComponent } from "../../components/categories-showcase/categories-showcase.component";
import { PromotionsComponent } from "../../components/promotions/promotions.component";
import { CustomerReviewsComponent } from "../../components/customer-reviews/customer-reviews.component";
import { CtaBannerComponent } from "../../components/cta-banner/cta-banner.component";
import { BlogTeaserComponent } from "../../components/blog-teaser/blog-teaser.component";
import { NewsletterSignupComponent } from "../../components/newsletter-signup/newsletter-signup.component";
import { ProductShowcaseComponent } from "../../components/product-showcase/product-showcase.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CategoriesShowcaseComponent, PromotionsComponent, CustomerReviewsComponent, CtaBannerComponent, BlogTeaserComponent, NewsletterSignupComponent, ProductShowcaseComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  productShowcases = [
    { categoryId: 3, title: 'المنتجات المميزة' },
    { categoryId: 1, title: 'أفضل منتجات العناية بالبشرة' },
    { categoryId: 2, title: 'أفضل منتجات العناية بالشعر' },
    { categoryId: 3, title: 'المنتجات الجديدة' },
    { categoryId: 1, title: 'الأكثر مبيعاً' },
    { categoryId: 2, title: 'أفضل منتجات العناية بالجسم' },
  ];


}
