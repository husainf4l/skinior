import { memo } from "react";

const CriticalCSS = memo(() => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for LCP optimization */
          .hero-section {
            min-height: 85vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Mobile-first optimizations */
          @media (max-width: 768px) {
            .hero-section {
              min-height: 90vh;
              padding: 1rem;
            }
            
            /* Reduce animation duration on mobile for better performance */
            * {
              animation-duration: 0.3s !important;
              transition-duration: 0.3s !important;
            }
            
            /* Optimize font loading */
            body {
              font-display: swap;
            }
          }
          
          /* Loading skeleton animation - critical for UX */
          .loading-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          /* Prevent layout shift */
          img[width][height] {
            height: auto;
          }
          
          /* Optimize focus styles for accessibility */
          *:focus-visible {
            outline: 2px solid #4F46E5;
            outline-offset: 2px;
          }
          
          /* Reduce motion for users who prefer it */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          
          /* Critical layout styles to prevent CLS */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          /* Optimize text rendering */
          body {
            text-rendering: optimizeSpeed;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `,
      }}
    />
  );
});

CriticalCSS.displayName = "CriticalCSS";

export default CriticalCSS;
