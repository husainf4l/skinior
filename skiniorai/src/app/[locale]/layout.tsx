import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import "../globals.css";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "../../contexts/AuthContext";
import type { Metadata } from "next";
import ConditionalNavigation from "../../components/ConditionalNavigation";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import GoogleAnalytics from "../../components/analytics/GoogleAnalytics";
import PerformanceTracker from "../../components/analytics/PerformanceTracker";

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
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

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

        {/* Floating Chat Widget - Independent Script */}
        {/* <script async src="/floating-chat.js"></script> */}

        {/* Critical CSS inline for LCP and mobile Speed Index */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .hero-section{min-height:85vh;}
            @media (max-width: 768px) {
              .hero-section{min-height:90vh;padding:1rem;}
              *{animation-duration:0.3s!important;transition-duration:0.3s!important;}
            }
            .loading-skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:loading 1.5s infinite;}
            @keyframes loading{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
          `,
          }}
        />
      </head>
      <body
        className="bg-white antialiased"
        style={{ backgroundColor: "white" }}
      >
        {/* Google Analytics */}
        {process.env.NODE_ENV === 'production' && (
          <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        )}
        
        {/* Performance Tracking */}
        <PerformanceTracker />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ConditionalNavigation>{children}</ConditionalNavigation>
          </AuthProvider>
        </NextIntlClientProvider>
        {/* Ensure a body-level container exists so the floating widget cannot be nested in other layout nodes */}
        <div id="skinior-floating-widget" />
        <FloatingChatWidget />
      </body>
    </html>
  );
}
