import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skinior.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/en/',
          '/ar/',
          '/en/products',
          '/ar/products',
          '/en/shop',
          '/ar/shop',
          '/en/blog',
          '/ar/blog',
          '/en/routines',
          '/ar/routines',
          '/en/skin-analysis',
          '/ar/skin-analysis',
          '/en/about',
          '/ar/about',
          '/en/privacy',
          '/ar/privacy',
          '/en/terms',
          '/ar/terms'
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/dashboard/',
          '/account/',
          '/checkout/',
          '/login',
          '/signup'
        ],
        crawlDelay: 1,
      },
      // Specific rules for search engine bots
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/dashboard/', '/account/', '/checkout/']
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/dashboard/', '/account/', '/checkout/']
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/image-sitemap.xml`
    ],
    host: baseUrl
  }
}