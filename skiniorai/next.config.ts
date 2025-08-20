import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Compiler optimizations for performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // PoweredByHeader for security
  poweredByHeader: false,
  
  // Advanced image optimization configuration
  images: {
    // Modern formats for better compression
    formats: ['image/avif', 'image/webp'],
    
    // Responsive breakpoints optimized for e-commerce
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    
    // Allow all external image hostnames (both http and https)
    // WARNING: allowing all hosts may have security and performance implications.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    
    // Caching strategy
    minimumCacheTTL: 31536000, // 1 year cache for product images
    
    // Allow SVG images from external sources
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
