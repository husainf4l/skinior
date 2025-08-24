import { memo } from "react";

const CriticalCSS = memo(() => {
  return (
    <style
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for LCP optimization - inline minimal above-the-fold styles */
          
          /* Essential font loading optimization */
          html {
            font-display: swap;
            scroll-behavior: smooth;
          }
          
          /* Prevent FOUC and layout shifts */
          body {
            opacity: 1;
            margin: 0;
            background-color: white;
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
          }
          
          /* Critical above-the-fold layout styles */
          .hero-section {
            min-height: 85vh;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background-color: white;
          }
          
          /* Navigation critical styles */
          nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
          }
          
          /* Critical button styles for CTA */
          .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 2rem;
            background-color: #1f2937;
            color: white;
            font-weight: 600;
            border-radius: 9999px;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          
          .btn-primary:hover {
            background-color: #111827;
            transform: translateY(-1px);
          }
          
          /* Fix H1 deprecation warning - explicit font sizes in sectioning elements */
          article h1, aside h1, nav h1, section h1 {
            font-size: 2.25rem; /* 36px */
            line-height: 2.5rem; /* 40px */
            font-weight: 700;
            margin: 0;
          }
          
          @media (min-width: 640px) {
            article h1, aside h1, nav h1, section h1 {
              font-size: 3rem; /* 48px */
              line-height: 1;
            }
          }
          
          @media (min-width: 768px) {
            article h1, aside h1, nav h1, section h1 {
              font-size: 3.75rem; /* 60px */
              line-height: 1;
            }
          }
          
          /* Prevent layout shift for images */
          img {
            height: auto;
            max-width: 100%;
            display: block;
          }
          
          /* Image lazy loading placeholder */
          .img-loading {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          /* Essential accessibility */
          *:focus-visible {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }
          
          /* Container critical styles */
          .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }
          
          /* Grid critical styles for categories */
          .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
          }
          
          /* Critical utilities */
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          
          /* Reduce motion for users who prefer it */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
            html { scroll-behavior: auto; }
          }
        `,
      }}
    />
  );
});

CriticalCSS.displayName = "CriticalCSS";

export default CriticalCSS;
