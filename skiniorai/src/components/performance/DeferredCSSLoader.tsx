"use client";

import { useEffect } from "react";

/**
 * Component to defer loading of non-critical CSS
 * This helps reduce render blocking resources
 */
export default function DeferredCSSLoader() {
  useEffect(() => {
    // Function to load non-critical CSS asynchronously
    const loadDeferredCSS = () => {
      // Get all stylesheets that are not critical
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
      
      stylesheets.forEach((stylesheet) => {
        const link = stylesheet as HTMLLinkElement;
        // Change media to all to activate the stylesheet
        if (link.media === 'print') {
          link.media = 'all';
        }
      });

      // Load fonts after critical content
      const fontPreloads = document.querySelectorAll('link[rel="preload"][as="font"]');
      fontPreloads.forEach((fontLink) => {
        const link = fontLink as HTMLLinkElement;
        link.rel = 'stylesheet';
      });
    };

    // Load deferred CSS after critical content is painted
    if (document.readyState === 'complete') {
      loadDeferredCSS();
    } else {
      window.addEventListener('load', loadDeferredCSS);
    }

    return () => {
      window.removeEventListener('load', loadDeferredCSS);
    };
  }, []);

  return null;
}

// Function to create deferred CSS link
export function createDeferredCSSLink(href: string, media = 'print') {
  return (
    <link
      rel="stylesheet"
      href={href}
      media={media}
      data-defer="true"
      onLoad={(e) => {
        const target = e.target as HTMLLinkElement;
        target.media = 'all';
      }}
    />
  );
}
