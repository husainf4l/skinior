import DOMPurify from 'isomorphic-dompurify';

// Content sanitization configuration
const SANITIZE_CONFIG = {
  // Allow common HTML tags for blog content
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'sup', 'sub',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span'
  ],
  
  // Allow common attributes
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'width', 'height',
    'class', 'id', 'style',
    'target', 'rel'
  ],
  
  // URL schemes to allow in links and images
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  
  // Remove empty elements
  REMOVE_EMPTY: ['p', 'div', 'span'],
  
  // Keep certain tags but remove their content
  FORBID_CONTENTS: ['script', 'style'],
  
  // Transform specific tags
  TRANSFORM_TAGS: {
    'script': 'code',
    'iframe': () => null, // Remove iframes completely
  }
};

/**
 * Sanitizes HTML content to prevent XSS attacks while preserving formatting
 */
export function sanitizeHTML(content: string): string {
  if (!content) return '';
  
  try {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: SANITIZE_CONFIG.ALLOWED_TAGS,
      ALLOWED_ATTR: SANITIZE_CONFIG.ALLOWED_ATTR,
      ALLOWED_URI_REGEXP: SANITIZE_CONFIG.ALLOWED_URI_REGEXP,
      REMOVE_EMPTY: SANITIZE_CONFIG.REMOVE_EMPTY,
      FORBID_CONTENTS: SANITIZE_CONFIG.FORBID_CONTENTS,
      
      // Add hooks for custom processing
      SANITIZE_DOM: true,
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false,
      
      // Custom transformations
      TRANSFORM_TAGS: SANITIZE_CONFIG.TRANSFORM_TAGS,
      
      // Add security headers
      ADD_TAGS: [],
      ADD_ATTR: [],
      
      // Custom hook to modify elements
      SANITIZE_NAMED_PROPS: {
        addHook: (hook: string, func: (...args: unknown[]) => unknown) => {
          DOMPurify.addHook(hook, func);
        }
      }
    });
  } catch (error) {
    console.error('Content sanitization failed:', error);
    // Return empty string if sanitization fails
    return '';
  }
}

/**
 * Sanitizes plain text by escaping HTML characters
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes URLs to prevent javascript: and data: URI attacks
 */
export function sanitizeURL(url: string): string {
  if (!url) return '';
  
  // Remove potentially dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  
  if (dangerousProtocols.test(url)) {
    return '';
  }
  
  // Ensure URLs are properly encoded
  try {
    const urlObject = new URL(url, window?.location?.origin || 'https://example.com');
    return urlObject.toString();
  } catch {
    // If URL parsing fails, sanitize as text
    return sanitizeText(url);
  }
}

/**
 * Validates and sanitizes email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeText(email.trim().toLowerCase());
  
  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitizes user input for search queries
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[^\w\s\-_.]/g, '') // Keep only alphanumeric, spaces, hyphens, underscores, dots
    .substring(0, 200); // Limit length
}

/**
 * Creates safe excerpt from content
 */
export function createSafeExcerpt(content: string, maxLength: number = 160): string {
  if (!content) return '';
  
  // First sanitize the content
  const sanitized = sanitizeHTML(content);
  
  // Remove HTML tags for excerpt
  const textOnly = sanitized.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  const cleaned = textOnly.replace(/\s+/g, ' ').trim();
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  // Truncate at word boundary
  const truncated = cleaned.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Validates and sanitizes file names
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';
  
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .substring(0, 255); // Limit length
}

/**
 * Content validation for blog posts
 */
export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedContent: string;
}

export function validateBlogContent(content: string, locale: string = 'en'): ContentValidationResult {
  const errors: string[] = [];
  
  if (!content || content.trim().length === 0) {
    errors.push(locale === 'ar' ? 'المحتوى مطلوب' : 'Content is required');
  }
  
  if (content.length > 50000) {
    errors.push(locale === 'ar' ? 'المحتوى طويل جداً' : 'Content is too long');
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi // Event handlers like onclick, onload, etc.
  ];
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push(locale === 'ar' ? 'المحتوى يحتوي على عناصر غير آمنة' : 'Content contains unsafe elements');
    }
  });
  
  // Sanitize content
  const sanitizedContent = sanitizeHTML(content);
  
  // Check if sanitization removed too much content
  const originalTextLength = content.replace(/<[^>]*>/g, '').length;
  const sanitizedTextLength = sanitizedContent.replace(/<[^>]*>/g, '').length;
  
  if (sanitizedTextLength < originalTextLength * 0.8) {
    errors.push(locale === 'ar' ? 'تم إزالة محتوى غير آمن من النص' : 'Unsafe content was removed from the text');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedContent
  };
}

/**
 * Rate limiting utility for preventing spam
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  
  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove expired requests
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < this.windowMs);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Export rate limiter instances
export const commentRateLimiter = new RateLimiter(60000, 5); // 5 comments per minute
export const searchRateLimiter = new RateLimiter(10000, 20); // 20 searches per 10 seconds

// Clean up rate limiters periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    commentRateLimiter.cleanup();
    searchRateLimiter.cleanup();
  }, 300000); // Cleanup every 5 minutes
}

/**
 * CSP (Content Security Policy) helper
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://trusted-cdn.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://api.example.com'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"]
};

export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}
