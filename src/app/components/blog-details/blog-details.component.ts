import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BlogDetailsComponent implements OnInit {
  blogs = [
    {
      id: 1,
      title: 'أسرار البشرة المتألقة',
      description: 'نصائح هامة للعناية بالبشرة وتحقيق إشراقة طبيعية.',
      content: `
      <h3>مقدمة</h3>
      <p>البشرة المتألقة هي حلم الجميع، فهي تعكس الصحة والجمال. في هذا المقال، سنقدم لك النصائح الأساسية لتحقيق هذا الحلم.</p>
    `,
    },
    {
      id: 2,
      title: 'صيحات المكياج لعام 2024',
      description: 'اكتشف أروع صيحات المكياج لهذا العام.',
      content: `
      <h3>أبرز الألوان</h3>
      <p>الألوان الجريئة مثل الأحمر الداكن والأزرق اللامع هي الرائجة هذا العام.</p>
    `,
    },
    {
      id: 3,
      title: 'فوائد الزيوت الطبيعية',
      description: 'تعرف على فوائد الزيوت الطبيعية لجمال بشرتك وشعرك.',
      content: `
      <h3>أهم الزيوت الطبيعية</h3>
      <p>اكتشفي كيف يمكن لزيوت مثل زيت جوز الهند وزيت الأركان أن تعزز جمالك.</p>
    `,
    },
  ];

  blog: any;
  blogId!: number;
  previousBlogId?: number;
  nextBlogId?: number;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to route param changes to detect changes without refreshing
    this.route.paramMap.subscribe((params) => {
      this.blogId = Number(params.get('id'));
      this.loadBlog(this.blogId);
    });
  }

  loadBlog(id: number): void {
    this.blog = this.blogs.find((b) => b.id === id);
    this.previousBlogId = id > 1 ? id - 1 : undefined;
    this.nextBlogId = id < this.blogs.length ? id + 1 : undefined;
  }

  navigateToBlog(blogId: number): void {
    this.router.navigate(['/blog', blogId]);
  }
}
