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
import { HighlightComponent } from "../../components/highlight/highlight.component";
import { Highlight2Component } from "../../components/highlight2/highlight2.component";
import { Highlight3Component } from "../../components/highlight3/highlight3.component";
import { RouterLink } from '@angular/router';
import { NewsletterComponent } from "../../components/newsletter/newsletter.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CategoriesShowcaseComponent, PromotionsComponent, CustomerReviewsComponent, CtaBannerComponent, BlogTeaserComponent, RouterLink, ProductShowcaseComponent, CommonModule, BrandsShowcaseComponent, BannerComponent, Hero2Component, HighlightComponent, Highlight2Component, Highlight3Component, NewsletterComponent],
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

  highlight = [
    { title: 'Coverderm Camouflage', description: 'امنحي ابتسامتك عناية فائقة مع معجون أسنان نباتي 100٪ يجمع بين الطبيعة والعناية الصحية لأسنان نظيفة وحماية تدوم.', imagemob: 'assets/images/banner/ecodenta-mob.webp', image: "assets/images/banner/ecodenta-desk.webp", altimage: 'ecodenta image' },
    { title: 'Coverderm Camouflage', description: 'تقدم مجموعة تغطية مثالية وطبيعية لعيوب البشرة تدوم طوال اليوم، مع حماية من أشعة الشمس ومقاومة للماء.', imagemob: 'assets/images/banner/coverderm-mob.webp', image: "assets/images/banner/coverderm-desk.webp", altimage: 'coverderm-card-image' }

  ]



}
