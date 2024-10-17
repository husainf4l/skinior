import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-teaser',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-teaser.component.html',
  styleUrl: './blog-teaser.component.css'
})
export class BlogTeaserComponent {
  blogTeasers = [
    {
      id: 1,
      title: 'أسرار البشرة المتألقة',
      description: 'تعرف على أهم النصائح لبشرة صحية ومتألقة بمكونات طبيعية آمنة وفعالة.',
      imageUrl: 'assets/images/category/haircare.jpg',
    },
    {
      id: 2,
      title: 'صيحات المكياج لعام 2024',
      description: 'اكتشف الألوان والأساليب الجديدة التي تميزت في هذا الموسم.',
      imageUrl: 'assets/images/category/haircare.jpg',
    },
    {
      id: 3,
      title: 'فوائد الزيوت الطبيعية',
      description: 'تعرف على فوائد الزيوت الطبيعية في تعزيز جمالك وصحة بشرتك وشعرك.',
      imageUrl: 'assets/images/category/haircare.jpg',
    },
    {
      id: 2,
      title: 'صيحات المكياج لعام 2024',
      description: 'اكتشف الألوان والأساليب الجديدة التي تميزت في هذا الموسم.',
      imageUrl: 'assets/images/category/haircare.jpg',
    },
    {
      id: 3,
      title: 'فوائد الزيوت الطبيعية',
      description: 'تعرف على فوائد الزيوت الطبيعية في تعزيز جمالك وصحة بشرتك وشعرك.',
      imageUrl: 'assets/images/category/haircare.jpg',
    },
  ];
}
