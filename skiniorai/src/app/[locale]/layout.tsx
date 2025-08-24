import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import "../globals.css";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "../../contexts/AuthContext";
import type { Metadata } from "next";
import ConditionalNavigation from "../../components/ConditionalNavigation";
import CriticalCSS from "../../components/performance/CriticalCSS";
import ResourceHints from "../../components/performance/ResourceHints";
import ErrorBoundary from "../../components/performance/ErrorBoundary";
import DeferredCSSLoader from "../../components/performance/DeferredCSSLoader";
import { Suspense, lazy } from "react";

// Lazy load non-critical components to reduce initial bundle size
const FloatingChatWidget = lazy(() => import("@/components/chat/FloatingChatWidget"));
const GoogleAnalytics = lazy(() => import("../../components/analytics/GoogleAnalytics"));
const PerformanceTracker = lazy(() => import("../../components/analytics/PerformanceTracker"));
const PerformanceMonitor = lazy(() => import("../../components/performance/PerformanceMonitor"));
const DeferredScriptLoader = lazy(() => import("../../components/performance/DeferredScriptLoader"));

export const dynamic = "force-static";

// Generate static paths for both locales - Next.js 15 best practice
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

// Optimized metadata generation for Next.js 15
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Skinior - Professional Skincare Solutions",
    description:
      "Advanced AI-powered skincare analysis and personalized recommendations",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com"
    ),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title: "Skinior - Professional Skincare Solutions",
      description:
        "Advanced AI-powered skincare analysis and personalized recommendations",
      locale: locale,
      type: "website",
    },
    other: {
      // Performance hints
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  const locales = ["en", "ar"];
  if (!locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  // Google Analytics Measurement ID from environment
  const GA_MEASUREMENT_ID =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={{ backgroundColor: "white" }}
    >
      <head>
        {/* Critical resource hints for performance */}
        <link rel="dns-prefetch" href="https://skinior.com" />
        <link rel="preconnect" href="https://skinior.com" crossOrigin="" />

        {/* Performance optimizations */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />

        {/* Mobile viewport optimization for Speed Index */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        {/* Resource hints for performance optimization */}
        <ResourceHints locale={locale} />

        {/* Critical CSS for LCP optimization */}
        <CriticalCSS />

        {/* Deferred CSS loader */}
        <DeferredCSSLoader />
      </head>
      <body
        className="bg-white antialiased"
        style={{ backgroundColor: "white" }}
      >
        {/* Non-critical components loaded asynchronously */}
        <Suspense fallback={null}>
          {process.env.NODE_ENV === "production" && (
            <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
          )}
          <PerformanceTracker />
          <PerformanceMonitor />
          <DeferredScriptLoader />
        </Suspense>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ErrorBoundary>
              <ConditionalNavigation>{children}</ConditionalNavigation>
            </ErrorBoundary>
          </AuthProvider>
        </NextIntlClientProvider>
        
        {/* Ensure a body-level container exists so the floating widget cannot be nested in other layout nodes */}
        <div id="skinior-floating-widget" />
        <Suspense fallback={null}>
          <FloatingChatWidget />
        </Suspense>
      </body>
    </html>
  );
}
