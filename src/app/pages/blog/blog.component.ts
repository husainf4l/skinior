import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  posts = [
    {
      category: 'درس تعليمي',
      date: 'منذ 14 يومًا',
      title: 'كيفية نشر موقع ويب ثابت بسرعة',
      description: 'تُستخدم المواقع الثابتة الآن لتشغيل العديد من المواقع وأصبحت أساسًا لمجموعة متنوعة من الأدوات التي تؤثر على كل من مصممي ومطوري الويب.',
      authorName: 'جيسي ليوس',
      authorImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png',
      iconPath: 'M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z'
    },
    {
      category: 'مقالة',
      date: 'منذ 14 يومًا',
      title: 'مشروعنا الأول مع React',
      description: 'تُستخدم المواقع الثابتة الآن لتشغيل العديد من المواقع وأصبحت أساسًا لمجموعة متنوعة من الأدوات التي تؤثر على كل من مصممي ومطوري الويب.',
      authorName: 'بوني جرين',
      authorImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png',
      iconPath: 'M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z'
    }
  ];
}
