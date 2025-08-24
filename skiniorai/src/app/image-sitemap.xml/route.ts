import { productsService } from '@/services/productsService';
import { ProductImage } from '@/types/product';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skinior.com';

export async function GET() {
  try {
    const result = await productsService.getProducts();
    const products = result.products;
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Add product images
    for (const product of products) {
      const productNameEn = product.title || 'Product';
      const productNameAr = product.titleAr || productNameEn;
      
      for (const locale of ['en', 'ar']) {
        const productName = locale === 'ar' ? productNameAr : productNameEn;
        const productUrl = `${baseUrl}/${locale}/products/${product.id}`;
        
        sitemap += `
  <url>
    <loc>${productUrl}</loc>`;
        
        if (product.images && product.images.length > 0) {
          product.images.forEach((image: ProductImage) => {
            if (image.url) {
              sitemap += `
    <image:image>
      <image:loc>${image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`}</image:loc>
      <image:caption>${image.altText || productName}</image:caption>
      <image:title>${productName}</image:title>
    </image:image>`;
            }
          });
        }
        
        sitemap += `
  </url>`;
      }
    }

    // Add static page images
    const staticImages = [
      {
        url: '/hero/hero1.webp',
        caption: 'Skinior AI Skincare Analysis',
        title: 'Advanced AI-Powered Skincare Solutions'
      },
      {
        url: '/logos/skinior-logo-black.png', 
        caption: 'Skinior Logo',
        title: 'Skinior Brand Logo'
      }
    ];

    for (const locale of ['en', 'ar']) {
      const homeUrl = `${baseUrl}/${locale}`;
      sitemap += `
  <url>
    <loc>${homeUrl}</loc>`;
    
      staticImages.forEach((image) => {
        sitemap += `
    <image:image>
      <image:loc>${baseUrl}${image.url}</image:loc>
      <image:caption>${image.caption}</image:caption>
      <image:title>${image.title}</image:title>
    </image:image>`;
      });
      
      sitemap += `
  </url>`;
    }

    sitemap += `
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating image sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}