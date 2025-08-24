// Custom polyfill configuration for modern browsers
// This file overrides Next.js default polyfills to reduce bundle size

// Only include essential polyfills for older mobile browsers
// All desktop browsers Chrome 95+, Firefox 95+, Safari 15+ support these natively

// Remove polyfills for features that are widely supported
if (typeof window !== 'undefined') {
    // These features are supported in all modern browsers
    // Array.prototype.at - supported since Chrome 92, Firefox 90, Safari 15.4
    // Array.prototype.flat - supported since Chrome 69, Firefox 62, Safari 12
    // Array.prototype.flatMap - supported since Chrome 69, Firefox 62, Safari 12
    // Object.fromEntries - supported since Chrome 73, Firefox 63, Safari 12.1
    // Object.hasOwn - supported since Chrome 93, Firefox 92, Safari 15.4
    // String.prototype.trimStart/trimEnd - supported since Chrome 66, Firefox 61, Safari 12

    // No polyfills needed for our target browsers
}
