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
  heroContent: any = {
    title: 'تألقي بثقة',
    title2: 'الدكتورة رهف - صيدلانية معتمدة تقود رحلتك نحو جمالك المتكامل',
    description:
      'ابدئي رحلتك اليوم مع الدكتورة رهف. استشارات مجانية ودعم متخصص لمساعدتك على تحقيق إطلالة تشعرين بها بالثقة والجمال.',
    buttonText: 'ابدئي الآن',
    buttonLink: '/consultation',
    learnMoreText: 'تعرفي على الدكتورة رهف',
    learnMoreLink: '/about-dr-rahaf',
    imageUrl: './assets/images/banner/mainbanner2.jpg',
    alt: 'الدكتورة رهف تقدم استشارات تجميلية'
  };




}
