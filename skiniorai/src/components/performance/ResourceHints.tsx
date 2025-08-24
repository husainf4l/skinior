import { memo } from "react";

interface ResourceHintsProps {
  locale: string;
}

const ResourceHints = memo(({ locale }: ResourceHintsProps) => {
  return (
    <>
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Preconnect to critical external origins */}
      <link
        rel="preconnect"
        href="https://www.googletagmanager.com"
        crossOrigin="anonymous"
      />

      {/* Preload critical images */}
      <link
        rel="preload"
        as="image"
        href={
          locale === "ar"
            ? "/logos/skinior-logo-white-ar.png"
            : "/logos/skinior-logo-white.png"
        }
        fetchPriority="high"
      />

      {/* Preload hero images */}
      <link
        rel="preload"
        as="image"
        href="/hero/hero1.webp"
        fetchPriority="high"
      />

      {/* Prefetch likely next page resources */}
      <link rel="prefetch" href={`/${locale}/shop`} />
      <link rel="prefetch" href={`/${locale}/skin-analysis`} />

      {/* Module preload for critical JavaScript */}
      <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />

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
