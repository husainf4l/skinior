"use client";

import { memo, useEffect } from "react";

const NonBlockingCSS = memo(() => {
  useEffect(() => {
    // Modern CSS loading optimization - defer non-critical CSS
    const deferCSS = () => {
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
      
      cssLinks.forEach((link) => {
        const linkElement = link as HTMLLinkElement;
        
        // Skip if already processed
        if (linkElement.dataset.deferred) return;
        
        // Store original media
        const originalMedia = linkElement.media || 'all';
        
        // Temporarily set to print to avoid blocking
        linkElement.media = 'print';
        
        // Change back after load
        linkElement.onload = () => {
          linkElement.media = originalMedia;
          linkElement.dataset.deferred = 'true';
        };
        
        // Fallback for browsers without onload support
        setTimeout(() => {
          if (!linkElement.dataset.deferred) {
            linkElement.media = originalMedia;
            linkElement.dataset.deferred = 'true';
          }
        }, 3000);
      });
    };
    
    // Run immediately and on DOM changes
    deferCSS();
    
    // Also defer on page transitions
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          deferCSS();
        }
      });
    });
    
    observer.observe(document.head, { childList: true });
    
    return () => observer.disconnect();
  }, []);

  return null;
});

NonBlockingCSS.displayName = "NonBlockingCSS";

export default NonBlockingCSS;
