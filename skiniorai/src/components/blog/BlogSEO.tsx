"use client";

import Head from "next/head";
import { BlogPost } from "../../types/blog";

interface BlogSEOProps {
  post?: BlogPost;
  locale: string;
  isPostPage?: boolean;
  posts?: BlogPost[];
}

export const BlogSEO = ({
  post,
  locale,
  isPostPage = false,
  posts = [],
}: BlogSEOProps) => {
  const getText = (textObj: { en: string; ar: string }) => {
    return textObj[locale as keyof typeof textObj] || textObj.en;
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://skinior.com";

  // Generate structured data for blog post
  const generatePostStructuredData = (post: BlogPost) => {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: getText(post.title),
      description: getText(post.excerpt),
      image: {
        "@type": "ImageObject",
        url: post.featuredImage,
        width: 1200,
        height: 630,
        alt: getText(post.title),
      },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        "@type": "Person",
        name: getText(post.author.name),
        image: post.author.avatar,
        description: getText(post.author.bio),
        url:
          post.author.socialLinks?.website ||
          `${baseUrl}/author/${post.author.id}`,
        sameAs: [
          post.author.socialLinks?.twitter,
          post.author.socialLinks?.linkedin,
        ].filter(Boolean),
      },
      publisher: {
        "@type": "Organization",
        name: "Skinior",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logos/skinior-logo-black.png`,
          width: 200,
          height: 60,
        },
        url: baseUrl,
        sameAs: [
          "https://facebook.com/skinior",
          "https://twitter.com/skinior",
          "https://instagram.com/skinior",
        ],
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/${locale}/blog/${post.id}`,
      },
      articleSection: getText(post.category.name),
      keywords: post.tags.map((tag) => getText(tag.name)).join(", "),
      wordCount: getText(post.content)
        .replace(/<[^>]*>/g, "")
        .split(" ").length,
      timeRequired: post.readTime[locale as keyof typeof post.readTime],
      url: `${baseUrl}/${locale}/blog/${post.id}`,
      commentCount: post.commentsCount || 0,
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/LikeAction",
          userInteractionCount: post.likes || 0,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ViewAction",
          userInteractionCount: post.views || 0,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CommentAction",
          userInteractionCount: post.commentsCount || 0,
        },
      ],
    };
  };

  // Generate structured data for blog listing
  const generateBlogStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: locale === "ar" ? "مدونة سكينيور" : "Skinior Blog",
      description:
        locale === "ar"
          ? "اكتشف أحدث نصائح العناية بالبشرة والمقالات المتخصصة من خبراء سكينيور"
          : "Discover expert insights and evidence-based guidance for healthier, more radiant skin",
      url: `${baseUrl}/${locale}/blog`,
      author: {
        "@type": "Organization",
        name: "Skinior",
        url: baseUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "Skinior",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logos/skinior-logo-black.png`,
        },
      },
      blogPost: posts.slice(0, 10).map((post) => ({
        "@type": "BlogPosting",
        headline: getText(post.title),
        url: `${baseUrl}/${locale}/blog/${post.id}`,
        datePublished: post.publishedAt,
        author: {
          "@type": "Person",
          name: getText(post.author.name),
        },
        image: post.featuredImage,
      })),
    };
  };

  // Generate breadcrumb structured data
  const generateBreadcrumbData = () => {
    const breadcrumbs = [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ar" ? "الرئيسية" : "Home",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "ar" ? "المدونة" : "Blog",
        item: `${baseUrl}/${locale}/blog`,
      },
    ];

    if (post && isPostPage) {
      breadcrumbs.push({
        "@type": "ListItem",
        position: 3,
        name: getText(post.title),
        item: `${baseUrl}/${locale}/blog/${post.id}`,
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs,
    };
  };

  // Generate FAQ structured data for posts with Q&A content
  const generateFAQData = (post: BlogPost) => {
    const content = getText(post.content);
    const faqs: Array<{ question: string; answer: string }> = [];

    // Extract Q&A patterns from content
    const qaPairs = content.match(
      /<h[2-6][^>]*>([^<]*\?[^<]*)<\/h[2-6]>\s*<p>([^<]*)<\/p>/gi
    );

    if (qaPairs && qaPairs.length > 0) {
      qaPairs.forEach((pair) => {
        const questionMatch = pair.match(
          /<h[2-6][^>]*>([^<]*\?[^<]*)<\/h[2-6]>/
        );
        const answerMatch = pair.match(/<p>([^<]*)<\/p>/);

        if (questionMatch && answerMatch) {
          faqs.push({
            question: questionMatch[1].trim(),
            answer: answerMatch[1].trim(),
          });
        }
      });
    }

    if (faqs.length > 0) {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };
    }

    return null;
  };

  if (isPostPage && post) {
    const title = getText(post.seoTitle || post.title);
    const description = getText(post.seoDescription || post.excerpt);
    const postUrl = `${baseUrl}/${locale}/blog/${post.id}`;
    const faqData = generateFAQData(post);

    return (
      <Head>
        {/* Basic Meta Tags */}
        <title>{title} | Skinior</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={post.tags.map((tag) => getText(tag.name)).join(", ")}
        />
        <meta name="author" content={getText(post.author.name)} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={postUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:image:alt" content={getText(post.title)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Skinior" />
        <meta
          property="og:locale"
          content={locale === "ar" ? "ar_SA" : "en_US"}
        />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        <meta property="article:author" content={getText(post.author.name)} />
        <meta
          property="article:section"
          content={getText(post.category.name)}
        />
        {post.tags.map((tag, index) => (
          <meta
            key={index}
            property="article:tag"
            content={getText(tag.name)}
          />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={post.featuredImage} />
        <meta name="twitter:image:alt" content={getText(post.title)} />
        <meta name="twitter:site" content="@skinior" />
        <meta name="twitter:creator" content="@skinior" />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePostStructuredData(post)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbData()),
          }}
        />
        {faqData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqData),
            }}
          />
        )}

        {/* Alternate Language Links */}
        <link
          rel="alternate"
          href={`${baseUrl}/en/blog/${post.id}`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`${baseUrl}/ar/blog/${post.id}`}
          hrefLang="ar"
        />
        <link rel="alternate" href={postUrl} hrefLang="x-default" />
      </Head>
    );
  }

  // Blog listing page SEO
  const title =
    locale === "ar"
      ? "مدونة سكينيور - نصائح العناية بالبشرة"
      : "Skinior Blog - Skincare Tips & Insights";
  const description =
    locale === "ar"
      ? "اكتشف أحدث نصائح العناية بالبشرة والمقالات المتخصصة من خبراء سكينيور. نصائح فعالة للحصول على بشرة صحية ومشرقة."
      : "Discover expert skincare insights, tips, and evidence-based guidance for healthier, more radiant skin from Skinior professionals.";
  const blogUrl = `${baseUrl}/${locale}/blog`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={
          locale === "ar"
            ? "العناية بالبشرة, نصائح, مدونة, سكينيور"
            : "skincare, tips, blog, beauty, skin health, Skinior"
        }
      />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large"
      />
      <link rel="canonical" href={blogUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={blogUrl} />
      <meta property="og:image" content={`${baseUrl}/hero/hero1.webp`} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Skinior" />
      <meta
        property="og:locale"
        content={locale === "ar" ? "ar_SA" : "en_US"}
      />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}/hero/hero1.webp`} />
      <meta name="twitter:site" content="@skinior" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogStructuredData()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbData()),
        }}
      />

      {/* Alternate Language Links */}
      <link rel="alternate" href={`${baseUrl}/en/blog`} hrefLang="en" />
      <link rel="alternate" href={`${baseUrl}/ar/blog`} hrefLang="ar" />
      <link rel="alternate" href={blogUrl} hrefLang="x-default" />
    </Head>
  );
};
