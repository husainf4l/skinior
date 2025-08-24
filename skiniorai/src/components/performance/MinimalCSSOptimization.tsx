/**
 * Minimal CSS optimization for render blocking
 * Only defer non-critical CSS that won't affect LCP
 */

// Add a simple script to defer non-critical CSS
if (typeof document !== 'undefined') {
  // Load non-critical CSS after page load
  window.addEventListener('load', () => {
    // Create and inject any deferred stylesheets here
    // Currently keeping minimal to avoid breaking existing performance
  });
}

export default function MinimalCSSOptimization() {
  return null;
}
