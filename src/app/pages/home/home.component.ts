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
import { Banner } from '../../services/models/interfaces.model';
import { BannerComponent } from "../../components/banner/banner.component";
import { Hero2Component } from "../../components/hero2/hero2.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CategoriesShowcaseComponent, PromotionsComponent, CustomerReviewsComponent, CtaBannerComponent, BlogTeaserComponent, ProductShowcaseComponent, CommonModule, BrandsShowcaseComponent, BannerComponent, Hero2Component],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  productShowcases = [
    { categoryHandle: 'skincare', title: 'أفضل منتجات العناية بالبشرة' },
    { categoryHandle: "hair-care", title: 'أفضل منتجات العناية بالشعر' },
    { categoryHandle: "make-up", title: 'أفضل منتجات المكياج' },
    { categoryHandle: "oral-care", title: 'أفضل منتجات العناية بالفم' },
    { categoryHandle: "body-care", title: 'أفضل منتجات العناية بالجسم' },
  ];


}
