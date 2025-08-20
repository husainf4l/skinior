import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import "../../globals.css";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "../../../contexts/AuthContext";

export default async function DashboardLayout({
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

        {/* Critical CSS inline for LCP and mobile Speed Index */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .hero-section{min-height:85vh;contain:layout;}
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}