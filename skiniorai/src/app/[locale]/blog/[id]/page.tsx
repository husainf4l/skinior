import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../../i18n/routing";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-static";

// Blog data - Simple example with one post
const blogPosts = [
  {
    id: 1,
    title: {
      en: "The Science Behind Vitamin C in Skincare",
      ar: "العلم وراء فيتامين C في العناية بالبشرة"
    },
    excerpt: {
      en: "Discover how vitamin C transforms your skin at the cellular level and why it's considered the gold standard in anti-aging skincare.",
      ar: "اكتشف كيف يحول فيتامين C بشرتك على المستوى الخلوي ولماذا يعتبر المعيار الذهبي في العناية المضادة للشيخوخة."
    },
    content: {
      en: `
<p>Vitamin C is one of the most researched and scientifically proven ingredients in skincare. As a potent antioxidant, it plays a crucial role in collagen synthesis, skin protection, and cellular repair.</p>

<h2>How Vitamin C Works at the Cellular Level</h2>
<p>At the molecular level, vitamin C (L-ascorbic acid) serves as a cofactor for collagen synthesis. It helps convert proline and lysine into hydroxyproline and hydroxylysine, which are essential building blocks for strong, healthy collagen.</p>

<h2>The Antioxidant Powerhouse</h2>
<p>Free radicals from UV exposure, pollution, and stress damage skin cells daily. Vitamin C neutralizes these harmful molecules, preventing oxidative stress that leads to premature aging, dark spots, and inflammation.</p>

<h2>Benefits You Can See</h2>
<ul>
<li><strong>Brightening:</strong> Inhibits tyrosinase enzyme, reducing melanin production</li>
<li><strong>Anti-aging:</strong> Stimulates collagen production for firmer skin</li>
<li><strong>Protection:</strong> Guards against environmental damage</li>
<li><strong>Healing:</strong> Accelerates skin repair and reduces inflammation</li>
</ul>

<h2>Choosing the Right Form</h2>
<p>Not all vitamin C is created equal. L-ascorbic acid is the most potent but also the most unstable. Stable derivatives like magnesium ascorbyl phosphate and sodium ascorbyl phosphate offer gentler alternatives with longer shelf life.</p>

<h2>Application Tips</h2>
<p>Apply vitamin C serum to clean skin in the morning, followed by moisturizer and broad-spectrum SPF. Start with lower concentrations (10-15%) and gradually increase as your skin builds tolerance.</p>

<p>Remember: consistency is key. With regular use, most people see noticeable improvements in skin brightness and texture within 4-6 weeks.</p>
      `,
      ar: `
<p>فيتامين C هو أحد أكثر المكونات بحثاً وإثباتاً علمياً في العناية بالبشرة. كمضاد أكسدة قوي، يلعب دوراً حاسماً في تكوين الكولاجين وحماية البشرة وإصلاح الخلايا.</p>

<h2>كيف يعمل فيتامين C على المستوى الخلوي</h2>
<p>على المستوى الجزيئي، يعمل فيتامين C (حمض الأسكوربيك) كعامل مساعد لتكوين الكولاجين. يساعد في تحويل البرولين والليسين إلى هيدروكسي برولين وهيدروكسي ليسين، وهي اللبنات الأساسية للكولاجين القوي والصحي.</p>

<h2>قوة مضادات الأكسدة</h2>
<p>الجذور الحرة من التعرض للأشعة فوق البنفسجية والتلوث والإجهاد تضر خلايا البشرة يومياً. فيتامين C يعادل هذه الجزيئات الضارة، مما يمنع الإجهاد التأكسدي الذي يؤدي إلى الشيخوخة المبكرة والبقع الداكنة والالتهاب.</p>

<h2>الفوائد التي يمكنك رؤيتها</h2>
<ul>
<li><strong>الإشراق:</strong> يثبط إنزيم التيروزيناز، مما يقلل إنتاج الميلانين</li>
<li><strong>مكافحة الشيخوخة:</strong> يحفز إنتاج الكولاجين للحصول على بشرة أكثر شداً</li>
<li><strong>الحماية:</strong> يحمي من الأضرار البيئية</li>
<li><strong>الشفاء:</strong> يسرع إصلاح البشرة ويقلل الالتهاب</li>
</ul>

<h2>اختيار الشكل المناسب</h2>
<p>ليس كل فيتامين C متساوياً. حمض الأسكوربيك هو الأقوى ولكنه أيضاً الأكثر عدم استقراراً. المشتقات المستقرة مثل فوسفات الأسكوربيل المغنيسيوم وفوسفات الأسكوربيل الصوديوم تقدم بدائل أكثر لطفاً مع عمر أطول.</p>

<h2>نصائح للتطبيق</h2>
<p>ضع سيروم فيتامين C على البشرة النظيفة في الصباح، متبوعاً بالمرطب وواقي الشمس واسع الطيف. ابدأ بتراكيز أقل (10-15%) وزد تدريجياً مع تطوير تحمل بشرتك.</p>

<p>تذكر: الاستمرارية هي المفتاح. مع الاستخدام المنتظم، يرى معظم الناس تحسناً ملحوظاً في إشراق البشرة وملمسها خلال 4-6 أسابيع.</p>
      `
    },
    image: "/hero/hero1.webp",
    date: "2024-01-15",
    readTime: { en: "5 min read", ar: "5 دقائق قراءة" },
    category: { en: "Science", ar: "العلوم" },
    author: { 
      name: { en: "Dr. Sarah Johnson", ar: "د. سارة جونسون" },
      avatar: "/hero/hero2.webp",
      bio: { 
        en: "Dermatologist and skincare researcher with 15 years of experience",
        ar: "طبيبة جلدية وباحثة في العناية بالبشرة مع 15 عاماً من الخبرة"
      }
    },
    featured: true,
    tags: {
      en: ["Vitamin C", "Anti-aging", "Skincare Science", "Antioxidants"],
      ar: ["فيتامين C", "مكافحة الشيخوخة", "علوم العناية بالبشرة", "مضادات الأكسدة"]
    }
  }
];

// Generate static params for all blog posts and locales
export function generateStaticParams() {
  const params = [];
  for (const locale of routing.locales) {
    for (const post of blogPosts) {
      params.push({ locale, id: post.id.toString() });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const post = blogPosts.find(p => p.id.toString() === id);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const title = post.title[locale as keyof typeof post.title];
  const excerpt = post.excerpt[locale as keyof typeof post.excerpt];

  return {
    title: `${title} | Skinior Blog`,
    description: excerpt,
    openGraph: {
      title: `${title} | Skinior Blog`,
      description: excerpt,
      type: 'article',
      locale: locale,
      publishedTime: post.date,
      authors: [post.author.name[locale as keyof typeof post.author.name]],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    alternates: {
      canonical: `/${locale}/blog/${id}`,
      languages: {
        en: `/en/blog/${id}`,
        ar: `/ar/blog/${id}`,
      },
    },
    keywords: post.tags[locale as keyof typeof post.tags].join(', '),
  };
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  const post = blogPosts.find(p => p.id.toString() === id);

  if (!post) {
    notFound();
  }

  // Ensure we have valid locale and content
  if (!post.title[locale as keyof typeof post.title] || 
      !post.content[locale as keyof typeof post.content]) {
    console.warn(`Missing content for locale ${locale} on post ${id}`);
    // Fallback to English if current locale content is missing
    const fallbackLocale = 'en';
    if (!post.title[fallbackLocale as keyof typeof post.title]) {
      notFound();
    }
  }

  // Since we only have one post, no navigation needed

  return (
    <div key={`blog-post-${locale}-${id}`} className="min-h-screen bg-white">
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title[locale as keyof typeof post.title],
            "description": post.excerpt[locale as keyof typeof post.excerpt],
            "image": post.image,
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
              "@type": "Person",
              "name": post.author.name[locale as keyof typeof post.author.name]
            },
            "publisher": {
              "@type": "Organization",
              "name": "Skinior",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `/${locale}/blog/${id}`
            }
          })
        }}
      />

      {/* Hero Section - Apple Style */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {post.category[locale as keyof typeof post.category]}
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <time className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-sm text-gray-500">
                {post.readTime[locale as keyof typeof post.readTime]}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {post.title[locale as keyof typeof post.title]}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto">
              {post.excerpt[locale as keyof typeof post.excerpt]}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={post.image}
              alt={post.title[locale as keyof typeof post.title]}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Author Info - Apple Style */}
        <div className="flex items-center gap-6 mb-16 pb-12 border-b border-gray-100">
          <img
            src={post.author.avatar}
            alt={post.author.name[locale as keyof typeof post.author.name]}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {post.author.name[locale as keyof typeof post.author.name]}
            </h3>
            <p className="text-gray-600 font-light">
              {post.author.bio[locale as keyof typeof post.author.bio]}
            </p>
          </div>
        </div>

        {/* Article Content - Enhanced Typography */}
        <div 
          className="prose prose-xl max-w-none prose-gray prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-p:font-light prose-p:mb-6 prose-li:text-lg prose-li:font-light prose-strong:font-semibold prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ 
            __html: post.content[locale as keyof typeof post.content] 
          }}
        />

        {/* Tags - Apple Style */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <div className="flex flex-wrap gap-3">
            {post.tags[locale as keyof typeof post.tags].map((tag, index) => (
              <span
                key={index}
                className="bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Share Buttons - Apple Style */}
        <div className="mt-12 pt-12 border-t border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">
            {locale === 'ar' ? 'شارك المقال' : 'Share this article'}
          </h4>
          <div className="flex gap-4">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium">
              {locale === 'ar' ? 'فيسبوك' : 'Facebook'}
            </button>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium">
              {locale === 'ar' ? 'تويتر' : 'Twitter'}
            </button>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium">
              {locale === 'ar' ? 'لينكد إن' : 'LinkedIn'}
            </button>
          </div>
        </div>
      </article>


      {/* Back to Blog - Apple Style */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group"
          >
            <svg className={`w-4 h-4 ${locale === 'ar' ? 'ml-2 rotate-180' : 'mr-2'} transition-transform group-hover:-translate-x-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'ar' ? 'العودة إلى النصائح' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    </div>
  );
}