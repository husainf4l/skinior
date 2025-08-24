import { memo } from "react";

const CriticalCSS = memo(() => {
  return (
    <style
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          /* Minimal critical CSS - Let Tailwind v4 handle all utilities */
          
          /* Essential performance optimizations only */
          html {
            font-display: swap;
          }
          
          /* Prevent FOUC */
          body {
            opacity: 1;
          }
          
          /* Fix H1 deprecation warning - explicit font sizes in sectioning elements */
          article h1, aside h1, nav h1, section h1 {
            font-size: 2.25rem; /* 36px */
            line-height: 2.5rem; /* 40px */
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
          }
          
          /* Essential accessibility */
          *:focus-visible {
            outline: 2px solid #3b82f6;
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
        `,
      }}
    />
  );
});

CriticalCSS.displayName = "CriticalCSS";

export default CriticalCSS;
