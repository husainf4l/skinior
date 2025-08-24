"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";

interface ResourceHintsProps {
  locale: string;
}

const ResourceHints = memo(({ locale }: ResourceHintsProps) => {
  const pathname = usePathname();
  
  // Only preload hero image on the home page
  const isHomePage = pathname === `/${locale}` || pathname === '/en' || pathname === '/ar';
  const preloadHeroImage = isHomePage;
  return (
    <>
      {/* DNS prefetching for external resources */}
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Early connection establishment for critical resources */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* Preload critical images - only those used immediately */}
      <link
        rel="preload"
        as="image"
        href={
          locale === "ar"
            ? "/logos/skinior-logo-black-ar.png"
            : "/logos/skinior-logo-black.png"
        }
        fetchPriority="high"
      />

      {/* Preload hero images - only the primary one used immediately and only on homepage */}
      {preloadHeroImage && (
        <>
          <link
            rel="preload"
            as="image"
            href="/hero/hero1.webp"
            fetchPriority="high"
            media="(min-width: 640px)"
          />
          {/* Prefetch (not preload) the second hero image for smoother carousel */}
          <link
            rel="prefetch"
            as="image"
            href="/hero/hero2.webp"
          />
        </>
      )}

      {/* Prefetch likely next page resources - only on homepage */}
      {isHomePage && (
        <>
          <link rel="prefetch" href={`/${locale}/shop`} />
          <link rel="prefetch" href={`/${locale}/skin-analysis`} />
        </>
      )}

      {/* Early hints for navigation */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta name="theme-color" content="#ffffff" />

      {/* Resource timing API */}
      <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
    </>
  );
});

ResourceHints.displayName = "ResourceHints";

export default ResourceHints;
