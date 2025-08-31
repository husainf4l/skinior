import { MetadataRoute } from 'next'
import { routing } from '../i18n/routing'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrls = [
    '',
    '/login',
    '/dashboard',
    '/news',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    '/gdpr',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routing.locales.forEach(locale => {
    baseUrls.forEach(url => {
      const fullUrl = locale === routing.defaultLocale 
        ? `https://skinior.com${url}`
        : `https://skinior.com/${locale}${url}`;
      
      sitemapEntries.push({
        url: fullUrl,
        lastModified: new Date(),
        changeFrequency: url === '' ? 'monthly' : url === '/news' ? 'weekly' : 'yearly',
        priority: url === '' ? 1 : url === '/dashboard' ? 0.7 : url === '/news' ? 0.8 : 0.5,
      });
    });
  });

  return sitemapEntries;
}