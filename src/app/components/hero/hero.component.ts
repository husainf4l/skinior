import { Component } from '@angular/core';
import { HeroContent } from '../../services/models/interfaces.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  heroContent: HeroContent = {
    title: 'اكتشفي جمالك مع سكينيور',
    description: 'تميزي بأفضل منتجات العناية بالبشرة، المصممة لإبراز جمالك الطبيعي. اختبري الأناقة في أبسط تفاصيلك.',
    buttonText: 'تسوقي الآن',
    buttonLink: '/shop',
    learnMoreText: 'اكتشفي المزيد',
    learnMoreLink: '/learn-more',
    imageUrl: './assets/images/banner/bannermain.webp',
    alt: 'a skinior girl image'
  };
}
