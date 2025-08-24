import Head from 'next/head'

interface GlobalSEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  locale?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  structuredData?: object
}

export default function GlobalSEO({
  title = "Skinior - Professional Skincare Solutions",
  description = "Advanced AI-powered skincare analysis and personalized recommendations for healthier, more radiant skin",
  keywords = "skincare, beauty, AI analysis, personalized recommendations, skin health",
  image,
  url,
  locale = "en",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noindex = false,
  structuredData
}: GlobalSEOProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skinior.com'
  const fullUrl = url || baseUrl
  const ogImage = image || `${baseUrl}/hero/hero1.webp`
  const isRTL = locale === 'ar'

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={noindex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} 
      />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Language alternatives */}
      <link rel="alternate" href={`${baseUrl}/en${url?.replace(baseUrl, '').replace(/^\/(en|ar)/, '') || ''}`} hrefLang="en" />
      <link rel="alternate" href={`${baseUrl}/ar${url?.replace(baseUrl, '').replace(/^\/(en|ar)/, '') || ''}`} hrefLang="ar" />
      <link rel="alternate" href={fullUrl} hrefLang="x-default" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Skinior" />
      <meta property="og:locale" content={isRTL ? "ar_SA" : "en_US"} />
      
      {/* Article specific OG tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.length > 0 && 
        tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))
      }

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@skinior" />
      <meta name="twitter:creator" content="@skinior" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Default Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Skinior",
            "url": baseUrl,
            "logo": `${baseUrl}/logos/skinior-logo-black.png`,
            "description": "Professional skincare solutions with AI-powered analysis",
            "sameAs": [
              "https://facebook.com/skinior",
              "https://twitter.com/skinior",
              "https://instagram.com/skinior"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": ["English", "Arabic"]
            }
          }),
        }}
      />
    </Head>
  )
}