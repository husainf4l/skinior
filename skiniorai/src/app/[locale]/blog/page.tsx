import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-static";

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'ar' ? 'المدونة - نصائح العناية بالبشرة | Skinior' : 'Blog - Skincare Tips & Insights | Skinior',
    description: locale === 'ar' 
      ? 'اكتشف أحدث نصائح العناية بالبشرة والمقالات المتخصصة من خبراء Skinior. نصائح فعالة للحصول على بشرة صحية ومشرقة.'
      : 'Discover the latest skincare tips, insights, and expert advice from Skinior professionals. Evidence-based skincare guidance for healthy, radiant skin.',
    openGraph: {
      title: locale === 'ar' ? 'المدونة - نصائح العناية بالبشرة | Skinior' : 'Blog - Skincare Tips & Insights | Skinior',
      description: locale === 'ar' 
        ? 'اكتشف أحدث نصائح العناية بالبشرة والمقالات المتخصصة من خبراء Skinior'
        : 'Discover the latest skincare tips, insights, and expert advice from Skinior professionals',
      type: 'website',
      locale: locale,
    },
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: '/en/blog',
        ar: '/ar/blog',
      },
    },
  };
}

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
    image: "/hero/hero1.webp",
    date: "2024-01-15",
    readTime: { en: "5 min read", ar: "5 دقائق قراءة" },
    category: { en: "Science", ar: "العلوم" },
    featured: true
  }
];

export default function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts: typeof blogPosts = [];

  return (
    <div className="min-h-screen bg-white">
      {/* Blog Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": locale === 'ar' ? 'مدونة Skinior' : 'Skinior Blog',
            "description": locale === 'ar' 
              ? 'اكتشف أحدث نصائح العناية بالبشرة والمقالات المتخصصة من خبراء Skinior'
              : 'Discover expert skincare insights, tips, and the latest innovations in skin health',
            "url": `/${locale}/blog`,
            "publisher": {
              "@type": "Organization",
              "name": "Skinior",
              "logo": {
                "@type": "ImageObject",
                "url": "/logos/skinior-logo-black.png"
              }
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title[locale as keyof typeof post.title],
              "description": post.excerpt[locale as keyof typeof post.excerpt],
              "image": post.image,
              "datePublished": post.date,
              "url": `/${locale}/blog/${post.id}`,
              "author": {
                "@type": "Person",
                "name": "Skinior Team"
              }
            }))
          })
        }}
      />

      {/* Hero Section - Apple Style */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-none animate-fade-in-up">
              {locale === 'ar' ? 'النصائح' : 'Blog'}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {locale === 'ar' 
                ? 'اكتشف أحدث نصائح العناية بالبشرة والمقالات المتخصصة من خبراء Skinior'
                : 'Expert insights and evidence-based guidance for healthier, more radiant skin'
              }
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Article - Apple Style */}
        {featuredPost && (
          <section className="mb-24">
            <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] animate-fade-in-up">
              <div className="lg:flex lg:items-center">
                <div className="lg:w-3/5">
                  <div className="relative h-96 lg:h-[600px] overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title[locale as keyof typeof featuredPost.title]}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
                <div className="lg:w-2/5 p-8 lg:p-12 lg:pl-16">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {featuredPost.category[locale as keyof typeof featuredPost.category]}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <time className="text-sm text-gray-500">
                      {new Date(featuredPost.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                    {featuredPost.title[locale as keyof typeof featuredPost.title]}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8 font-light">
                    {featuredPost.excerpt[locale as keyof typeof featuredPost.excerpt]}
                  </p>
                  <Link
                    href={`/${locale}/blog/${featuredPost.id}`}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors group"
                  >
                    {locale === 'ar' ? 'اقرأ المقال' : 'Read article'}
                    <svg className={`w-4 h-4 ${locale === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} transition-transform group-hover:translate-x-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Articles Grid - Apple Style */}
        <section>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16 text-center tracking-tight">
            {locale === 'ar' ? 'جميع المقالات' : 'Latest articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="group cursor-pointer blog-card animate-fade-in-up"
              >
                <Link href={`/${locale}/blog/${post.id}`} className="block">
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img
                      src={post.image}
                      alt={post.title[locale as keyof typeof post.title]}
                      className="w-full h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
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
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                      {post.title[locale as keyof typeof post.title]}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed font-light line-clamp-3">
                      {post.excerpt[locale as keyof typeof post.excerpt]}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Subscription - Apple Style */}
        <section className="mt-32 bg-gray-50 rounded-3xl p-12 lg:p-16 text-center animate-fade-in-up">
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            {locale === 'ar' ? 'ابق على اطلاع بأحدث النصائح' : 'Stay informed'}
          </h3>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto font-light">
            {locale === 'ar' 
              ? 'احصل على نصائح العناية بالبشرة الحصرية والمقالات الجديدة مباشرة في بريدك الإلكتروني'
              : 'Get the latest skincare insights and expert tips delivered to your inbox'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
              className="flex-1 px-6 py-4 rounded-full border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
            />
            <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300">
              {locale === 'ar' ? 'اشترك' : 'Subscribe'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}