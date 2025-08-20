import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - files that contain a dot (e.g. favicon.ico)
    // - Next.js internals starting with _next/
    // - API routes
    '/((?!_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/api/`, optionally with a locale prefix
    '/([\\w-]+)?/api/(.*)'
  ]
};