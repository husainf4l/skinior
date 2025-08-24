import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable source maps in production for debugging (can be controlled via env var)
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_ENABLE_SOURCE_MAPS === 'true',

  // Allow cross-origin requests from your domain during development
  allowedDevOrigins: ['skinior.com', 'www.skinior.com'],

  // Fix cross-origin warnings for better development experience
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },

  // Compiler optimizations for performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // PoweredByHeader for security
  poweredByHeader: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react', '@floating-ui/react'],
    scrollRestoration: true,
    // Optimize CSS loading
    optimizeCss: true,
    // Enable modern JS features
    esmExternals: true,
  },


  // Bundle analyzer and webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in production
    if (!dev) {
      config.devtool = 'source-map';
    }

    // CSS optimization for render blocking
    if (!dev && !isServer) {
      // Optimize CSS loading without external plugins
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      config.optimization.splitChunks.cacheGroups = config.optimization.splitChunks.cacheGroups || {};
    }

    // Exclude unnecessary polyfills for modern browsers
    if (!dev && !isServer) {
      // Replace Next.js default polyfills with a minimal set
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/dist/build/polyfills/polyfill-module': require.resolve('./polyfills.js'),
      };
    }

    // Optimize bundle splitting
    if (!dev && !isServer) {
      // Better tree shaking for large libraries
      config.optimization.providedExports = true;
      config.optimization.usedExports = true;

      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for large dependencies - exclude heavy libraries
          vendor: {
            name: 'vendors',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](?!(@livekit|livekit-client|isomorphic-dompurify|@floating-ui))/,
            priority: 20,
          },
          // Separate LiveKit into its own async chunk since it's large and not used everywhere
          livekit: {
            name: 'livekit',
            chunks: 'async', // Only load when needed
            test: /[\\/]node_modules[\\/](@livekit|livekit-client)/,
            priority: 40,
            enforce: true,
          },
          // DOMPurify separate async chunk
          dompurify: {
            name: 'dompurify',
            chunks: 'async',
            test: /[\\/]node_modules[\\/](isomorphic-)?dompurify/,
            priority: 35,
            enforce: true,
          },
          // Floating UI separate async chunk
          floatingui: {
            name: 'floating-ui',
            chunks: 'async',
            test: /[\\/]node_modules[\\/]@floating-ui/,
            priority: 32,
            enforce: true,
          },
          // Common chunk for shared components
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          // React and Next.js specific chunk
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 50,
            enforce: true,
          },
        },
      };
    }
    return config;
  },

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
