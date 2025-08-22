import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding blog data...');

  // Create blog categories
  const skinCareCategory = await prisma.blogCategory.create({
    data: {
      nameEn: 'Skincare Tips',
      nameAr: 'نصائح العناية بالبشرة',
      slugEn: 'skincare-tips',
      slugAr: 'نصائح-العناية-بالبشرة',
      descriptionEn: 'Professional skincare advice and tips',
      descriptionAr: 'نصائح مهنية للعناية بالبشرة',
      color: '#FF6B6B',
    },
  });

  const productReviewsCategory = await prisma.blogCategory.create({
    data: {
      nameEn: 'Product Reviews',
      nameAr: 'مراجعات المنتجات',
      slugEn: 'product-reviews',
      slugAr: 'مراجعات-المنتجات',
      descriptionEn: 'Honest reviews of skincare products',
      descriptionAr: 'مراجعات صادقة لمنتجات العناية بالبشرة',
      color: '#4ECDC4',
    },
  });

  const beautyTrendsCategory = await prisma.blogCategory.create({
    data: {
      nameEn: 'Beauty Trends',
      nameAr: 'اتجاهات الجمال',
      slugEn: 'beauty-trends',
      slugAr: 'اتجاهات-الجمال',
      descriptionEn: 'Latest beauty trends and techniques',
      descriptionAr: 'أحدث اتجاهات وتقنيات الجمال',
      color: '#45B7D1',
    },
  });

  // Create blog authors
  const author1 = await prisma.blogAuthor.create({
    data: {
      nameEn: 'Dr. Sarah Johnson',
      nameAr: 'د. سارة جونسون',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
      bioEn: 'Dr. Sarah Johnson is a board-certified dermatologist with over 10 years of experience in clinical dermatology and cosmetic procedures.',
      bioAr: 'د. سارة جونسون طبيبة أمراض جلدية معتمدة مع أكثر من 10 سنوات من الخبرة في طب الأمراض الجلدية والإجراءات التجميلية.',
      email: 'sarah@skinior.com',
      socialLinks: {
        twitter: 'https://twitter.com/drsarahjohnson',
        linkedin: 'https://linkedin.com/in/drsarahjohnson',
        website: 'https://drsarahjohnson.com',
      },
    },
  });

  const author2 = await prisma.blogAuthor.create({
    data: {
      nameEn: 'Ahmad Al-Hassan',
      nameAr: 'أحمد الحسن',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bioEn: 'Ahmad is a certified skincare specialist and beauty consultant with expertise in Middle Eastern skincare traditions.',
      bioAr: 'أحمد أخصائي عناية بالبشرة معتمد ومستشار جمال خبير في تقاليد العناية بالبشرة في الشرق الأوسط.',
      email: 'ahmad@skinior.com',
      socialLinks: {
        instagram: 'https://instagram.com/ahmadalhasan',
        linkedin: 'https://linkedin.com/in/ahmadalhasan',
      },
    },
  });

  // Create blog tags
  const tag1 = await prisma.blogTag.create({
    data: {
      nameEn: 'Anti-aging',
      nameAr: 'مكافحة الشيخوخة',
      slugEn: 'anti-aging',
      slugAr: 'مكافحة-الشيخوخة',
    },
  });

  const tag2 = await prisma.blogTag.create({
    data: {
      nameEn: 'Acne Treatment',
      nameAr: 'علاج حب الشباب',
      slugEn: 'acne-treatment',
      slugAr: 'علاج-حب-الشباب',
    },
  });

  const tag3 = await prisma.blogTag.create({
    data: {
      nameEn: 'Natural Skincare',
      nameAr: 'العناية الطبيعية بالبشرة',
      slugEn: 'natural-skincare',
      slugAr: 'العناية-الطبيعية-بالبشرة',
    },
  });

  const tag4 = await prisma.blogTag.create({
    data: {
      nameEn: 'Vitamin C',
      nameAr: 'فيتامين سي',
      slugEn: 'vitamin-c',
      slugAr: 'فيتامين-سي',
    },
  });

  // Create blog posts
  const post1 = await prisma.blogPost.create({
    data: {
      titleEn: 'The Complete Guide to Vitamin C in Skincare',
      titleAr: 'الدليل الشامل لفيتامين سي في العناية بالبشرة',
      slugEn: 'complete-guide-vitamin-c-skincare',
      slugAr: 'الدليل-الشامل-فيتامين-سي-العناية-بالبشرة',
      excerptEn: 'Discover everything you need to know about incorporating Vitamin C into your skincare routine for brighter, healthier skin.',
      excerptAr: 'اكتشف كل ما تحتاج لمعرفته حول دمج فيتامين سي في روتين العناية بالبشرة للحصول على بشرة أكثر إشراقاً وصحة.',
      contentEn: `# The Complete Guide to Vitamin C in Skincare

Vitamin C is one of the most powerful and well-researched ingredients in skincare. This comprehensive guide will help you understand everything about this amazing antioxidant.

## What is Vitamin C?

Vitamin C, also known as ascorbic acid, is a potent antioxidant that plays a crucial role in collagen synthesis and skin protection. In skincare, it's primarily used for:

- Brightening the skin
- Reducing hyperpigmentation
- Stimulating collagen production
- Protecting against environmental damage

## Benefits of Vitamin C for Skin

### 1. Antioxidant Protection
Vitamin C neutralizes free radicals that can cause premature aging and skin damage.

### 2. Collagen Synthesis
It stimulates the production of collagen, helping to maintain skin firmness and elasticity.

### 3. Brightening Effect
Regular use can lead to a more radiant and even-toned complexion.

### 4. Hyperpigmentation Reduction
Vitamin C can help fade dark spots and acne scars over time.

## How to Use Vitamin C in Your Routine

1. **Start slowly**: Begin with a lower concentration (10-15%)
2. **Apply in the morning**: Vitamin C works best during the day
3. **Use sunscreen**: Always follow with SPF protection
4. **Be consistent**: Results take 6-8 weeks to show

## Conclusion

Vitamin C is a skincare powerhouse that can transform your skin when used correctly. Start with a quality serum and be patient – your skin will thank you!`,
      contentAr: `# الدليل الشامل لفيتامين سي في العناية بالبشرة

فيتامين سي هو واحد من أقوى المكونات وأكثرها بحثاً في العناية بالبشرة. سيساعدك هذا الدليل الشامل على فهم كل شيء عن هذا المضاد المذهل للأكسدة.

## ما هو فيتامين سي؟

فيتامين سي، المعروف أيضاً باسم حمض الأسكوربيك، هو مضاد أكسدة قوي يلعب دوراً حاسماً في تخليق الكولاجين وحماية البشرة.

## فوائد فيتامين سي للبشرة

### 1. حماية مضادة للأكسدة
فيتامين سي يحيد الجذور الحرة التي يمكن أن تسبب الشيخوخة المبكرة وتلف الجلد.

### 2. تخليق الكولاجين
يحفز إنتاج الكولاجين، مما يساعد في الحفاظ على صلابة ومرونة البشرة.

### 3. تأثير الإشراق
الاستخدام المنتظم يمكن أن يؤدي إلى بشرة أكثر إشراقاً ولوناً متساوياً.

## كيفية استخدام فيتامين سي في روتينك

1. **ابدأ ببطء**: ابدأ بتركيز أقل (10-15%)
2. **ضعه في الصباح**: فيتامين سي يعمل بشكل أفضل خلال النهار
3. **استخدم واقي الشمس**: اتبع دائماً بحماية SPF
4. **كن متسقاً**: النتائج تستغرق 6-8 أسابيع لتظهر

## الخلاصة

فيتامين سي هو قوة في العناية بالبشرة يمكن أن يحول بشرتك عند استخدامه بشكل صحيح!`,
      featuredImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&h=600&fit=crop',
      ],
      publishedAt: new Date(),
      readTimeEn: '5 min read',
      readTimeAr: '5 دقائق قراءة',
      featured: true,
      published: true,
      seoTitleEn: 'Vitamin C Skincare Guide - Benefits & How to Use | Skinior',
      seoTitleAr: 'دليل فيتامين سي للعناية بالبشرة - الفوائد وطريقة الاستخدام | سكينيور',
      seoDescriptionEn: 'Complete guide to Vitamin C in skincare. Learn benefits, usage tips, and how to incorporate this powerful antioxidant into your routine.',
      seoDescriptionAr: 'دليل شامل لفيتامين سي في العناية بالبشرة. تعلم الفوائد ونصائح الاستخدام وكيفية دمج هذا المضاد القوي للأكسدة في روتينك.',
      views: 1250,
      likes: 42,
      commentsCount: 8,
      categoryId: skinCareCategory.id,
      authorId: author1.id,
    },
  });

  const post2 = await prisma.blogPost.create({
    data: {
      titleEn: '10 Natural Ingredients for Glowing Skin',
      titleAr: '10 مكونات طبيعية للحصول على بشرة متوهجة',
      slugEn: '10-natural-ingredients-glowing-skin',
      slugAr: '10-مكونات-طبيعية-بشرة-متوهجة',
      excerptEn: 'Explore these powerful natural ingredients that can help you achieve radiant, healthy-looking skin without harsh chemicals.',
      excerptAr: 'اكتشف هذه المكونات الطبيعية القوية التي يمكن أن تساعدك في الحصول على بشرة متألقة وصحية بدون مواد كيميائية قاسية.',
      contentEn: `# 10 Natural Ingredients for Glowing Skin

Nature provides us with incredible ingredients that can transform our skin. Here are 10 natural ingredients that can help you achieve that coveted glow.

## 1. Honey
Raw honey is a natural humectant with antimicrobial properties, perfect for hydrating and healing the skin.

## 2. Aloe Vera
Known for its soothing and healing properties, aloe vera is excellent for sensitive and irritated skin.

## 3. Green Tea
Rich in antioxidants, green tea helps protect the skin from environmental damage and reduces inflammation.

## 4. Rosehip Oil
Packed with vitamins A and C, rosehip oil helps with skin regeneration and reduces the appearance of scars.

## 5. Turmeric
This golden spice has anti-inflammatory properties and can help brighten the complexion.

## 6. Oatmeal
Gentle and soothing, oatmeal is perfect for sensitive skin and helps with exfoliation.

## 7. Jojoba Oil
Mimics the skin's natural sebum, making it suitable for all skin types.

## 8. Chamomile
Known for its calming properties, chamomile is perfect for sensitive and reactive skin.

## 9. Witch Hazel
A natural astringent that helps tighten pores and reduce excess oil.

## 10. Argan Oil
Rich in vitamin E and fatty acids, argan oil provides deep hydration and nourishment.

## How to Incorporate These Ingredients

Start slowly and patch test new ingredients. You can find these in commercial products or create DIY treatments at home.`,
      contentAr: `# 10 مكونات طبيعية للحصول على بشرة متوهجة

تزودنا الطبيعة بمكونات مذهلة يمكنها تحويل بشرتنا. إليك 10 مكونات طبيعية يمكن أن تساعدك في تحقيق ذلك التوهج المرغوب.

## 1. العسل
العسل الخام مرطب طبيعي بخصائص مضادة للميكروبات، مثالي لترطيب وشفاء البشرة.

## 2. الصبار
معروف بخصائصه المهدئة والشافية، الصبار ممتاز للبشرة الحساسة والمتهيجة.

## 3. الشاي الأخضر
غني بمضادات الأكسدة، يساعد الشاي الأخضر في حماية البشرة من الأضرار البيئية ويقلل الالتهاب.

## 4. زيت ثمر الورد
مليء بفيتامينات A وC، يساعد زيت ثمر الورد في تجديد البشرة ويقلل من ظهور الندبات.

## 5. الكركم
هذا التوابل الذهبي له خصائص مضادة للالتهابات ويمكن أن يساعد في إشراق البشرة.

## كيفية دمج هذه المكونات

ابدأ ببطء واختبر المكونات الجديدة على منطقة صغيرة. يمكنك العثور على هذه في المنتجات التجارية أو إنشاء علاجات DIY في المنزل.`,
      featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      readTimeEn: '7 min read',
      readTimeAr: '7 دقائق قراءة',
      featured: false,
      published: true,
      views: 890,
      likes: 28,
      commentsCount: 5,
      categoryId: skinCareCategory.id,
      authorId: author2.id,
    },
  });

  const post3 = await prisma.blogPost.create({
    data: {
      titleEn: 'The Best Anti-Aging Skincare Routine for Your 30s',
      titleAr: 'أفضل روتين للعناية بالبشرة المضاد للشيخوخة في الثلاثينيات',
      slugEn: 'best-anti-aging-skincare-routine-30s',
      slugAr: 'أفضل-روتين-مضاد-شيخوخة-ثلاثينيات',
      excerptEn: 'Prevention is key when it comes to aging. Learn how to create an effective anti-aging routine in your 30s.',
      excerptAr: 'الوقاية هي الأساس عندما يتعلق الأمر بالشيخوخة. تعلم كيفية إنشاء روتين فعال مضاد للشيخوخة في الثلاثينيات.',
      contentEn: `# The Best Anti-Aging Skincare Routine for Your 30s

Your 30s are the perfect time to start focusing on prevention and addressing the first signs of aging. Here's a comprehensive routine to keep your skin looking youthful.

## Morning Routine

### 1. Gentle Cleanser
Start with a mild cleanser that won't strip your skin's natural barrier.

### 2. Vitamin C Serum
Apply a vitamin C serum to protect against environmental damage and brighten your complexion.

### 3. Moisturizer
Use a hydrating moisturizer with hyaluronic acid to plump the skin.

### 4. Sunscreen (SPF 30+)
This is the most important anti-aging step. Never skip sunscreen!

## Evening Routine

### 1. Double Cleanse
Remove makeup and sunscreen with an oil cleanser, followed by your regular cleanser.

### 2. Retinol (2-3 times per week)
Start with a low concentration retinol to stimulate cell turnover and collagen production.

### 3. Hydrating Serum
Use a hyaluronic acid serum to boost hydration.

### 4. Night Moisturizer
Apply a richer moisturizer to repair and regenerate overnight.

### 5. Eye Cream
Don't forget the delicate eye area - use a targeted eye cream.

## Weekly Treatments

- **Exfoliation**: Use a gentle chemical exfoliant 1-2 times per week
- **Face Mask**: Apply a hydrating or anti-aging mask once per week

## Key Ingredients to Look For

- **Retinol**: Stimulates collagen production
- **Vitamin C**: Antioxidant protection
- **Hyaluronic Acid**: Deep hydration
- **Peptides**: Support collagen synthesis
- **Niacinamide**: Improves skin texture

## Tips for Success

1. Introduce new products gradually
2. Always patch test
3. Be consistent - results take time
4. Don't forget your neck and hands
5. Stay hydrated and eat a balanced diet

Remember, consistency is key when it comes to anti-aging skincare!`,
      contentAr: `# أفضل روتين للعناية بالبشرة المضاد للشيخوخة في الثلاثينيات

الثلاثينيات هي الوقت المثالي لبدء التركيز على الوقاية ومعالجة العلامات الأولى للشيخوخة. إليك روتين شامل للحفاظ على مظهر بشرتك الشاب.

## روتين الصباح

### 1. منظف لطيف
ابدأ بمنظف خفيف لن يزيل الحاجز الطبيعي لبشرتك.

### 2. سيروم فيتامين سي
ضع سيروم فيتامين سي للحماية من الأضرار البيئية وإشراق البشرة.

### 3. مرطب
استخدم مرطباً يحتوي على حمض الهيالورونيك لنفخ البشرة.

### 4. واقي الشمس (SPF 30+)
هذه أهم خطوة مضادة للشيخوخة. لا تتخطى واقي الشمس أبداً!

## روتين المساء

### 1. تنظيف مزدوج
أزل المكياج وواقي الشمس بمنظف زيتي، متبوعاً بمنظفك العادي.

### 2. الريتينول (2-3 مرات في الأسبوع)
ابدأ بتركيز منخفض من الريتينول لتحفيز تجديد الخلايا وإنتاج الكولاجين.

### 3. سيروم مرطب
استخدم سيروم حمض الهيالورونيك لتعزيز الترطيب.

### 4. مرطب ليلي
ضع مرطباً أغنى للإصلاح والتجديد أثناء الليل.

## العلاجات الأسبوعية

- **التقشير**: استخدم مقشر كيميائي لطيف 1-2 مرة في الأسبوع
- **قناع الوجه**: ضع قناع مرطب أو مضاد للشيخوخة مرة في الأسبوع

تذكر، الاستمرارية هي المفتاح عندما يتعلق الأمر بالعناية بالبشرة المضادة للشيخوخة!`,
      featuredImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      readTimeEn: '8 min read',
      readTimeAr: '8 دقائق قراءة',
      featured: true,
      published: true,
      views: 2100,
      likes: 67,
      commentsCount: 12,
      categoryId: skinCareCategory.id,
      authorId: author1.id,
    },
  });

  // Create blog post-tag relationships
  await prisma.blogPostTag.createMany({
    data: [
      { postId: post1.id, tagId: tag4.id }, // Vitamin C post + Vitamin C tag
      { postId: post2.id, tagId: tag3.id }, // Natural ingredients post + Natural skincare tag
      { postId: post3.id, tagId: tag1.id }, // Anti-aging post + Anti-aging tag
    ],
  });

  // Create some sample comments
  await prisma.blogComment.createMany({
    data: [
      {
        postId: post1.id,
        content: 'This is such a helpful guide! I just started using vitamin C and was wondering about the best practices.',
        authorName: 'Emma Wilson',
        authorEmail: 'emma@example.com',
        likes: 3,
      },
      {
        postId: post1.id,
        content: 'Can you recommend a good vitamin C serum for beginners?',
        authorName: 'Michael Chen',
        authorEmail: 'michael@example.com',
        likes: 1,
      },
      {
        postId: post2.id,
        content: 'I love using natural ingredients! Honey masks are my favorite.',
        authorName: 'Sarah Ahmed',
        authorEmail: 'sarah@example.com',
        likes: 5,
      },
    ],
  });

  // Create newsletter subscribers
  await prisma.blogNewsletterSubscriber.createMany({
    data: [
      { email: 'subscriber1@example.com', locale: 'en' },
      { email: 'subscriber2@example.com', locale: 'ar' },
      { email: 'subscriber3@example.com', locale: 'en' },
    ],
  });

  console.log('Blog data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });