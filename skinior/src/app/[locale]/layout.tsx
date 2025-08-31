import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "../globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PrivacyNoticePortal from "../../components/PrivacyNoticePortal";
import { AuthProvider } from "../../contexts/AuthContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import GoogleAnalytics from "../../components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Skinior - The World's First Agentic Skincare Platform",
  description:
    "Experience intelligent skincare that learns, adapts, and evolves with you. Skinior's AI-powered platform creates personalized routines that improve over time.",
  keywords:
    "skincare, AI skincare, personalized skincare, agentic skincare, intelligent beauty, adaptive routine, skin analysis",
  authors: [{ name: "Roxate Ltd" }],
  creator: "Roxate Ltd",
  publisher: "Roxate Ltd",
  metadataBase: new URL("https://skinior.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Skinior - The World's First Agentic Skincare Platform",
    description:
      "Experience intelligent skincare that learns, adapts, and evolves with you. Skinior's AI-powered platform creates personalized routines that improve over time.",
    url: "https://skinior.com",
    siteName: "Skinior",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skinior - The World's First Agentic Skincare Platform",
    description:
      "Experience intelligent skincare that learns, adapts, and evolves with you.",
    creator: "@skinior",
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
  verification: {
    google: "verification-token-here",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="scroll-smooth"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <GoogleAnalytics />
            <Navbar />
            {children}
            <Footer />
            <PrivacyNoticePortal />
            <Analytics />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
