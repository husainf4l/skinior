import { MetadataRoute } from 'next'
import { productsService } from '@/services/productsService'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skinior.com'
const locales = ['en', 'ar']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/products', 
    '/shop',
    '/blog',
    '/routines',
    '/skin-analysis',
    '/privacy',
    '/terms'
  ]

  // Add static routes for both locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/products' || route === '/blog' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/products' || route === '/blog' ? 0.9 : 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ar: `${baseUrl}/ar${route}`,
          },
        },
      })
    }
  }

  try {
    // Get dynamic product routes
    const result = await productsService.getProducts()
    const products = result.products
    
    for (const product of products) {
      for (const locale of locales) {
        sitemap.push({
          url: `${baseUrl}/${locale}/products/${product.id}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/products/${product.id}`,
              ar: `${baseUrl}/ar/products/${product.id}`,
            },
          },
        })
      }
    }
  } catch (error) {
    console.error('Error generating product sitemap entries:', error)
  }

  // Add blog routes if blog service exists
  try {
    // This would be dynamically generated based on your blog posts
    // Add blog post URLs here when you have a blog service
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error)
  }

  return sitemap
}