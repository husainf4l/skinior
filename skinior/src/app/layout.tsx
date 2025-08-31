import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const locale = await getLocale();

  const ogLocale = locale === "ar" ? "ar_SA" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Roxate Ltd" }],
    creator: "Roxate Ltd",
    publisher: "Roxate Ltd",
    metadataBase: new URL("https://skinior.com"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://skinior.com",
      siteName: "Skinior",
      type: "website",
      locale: ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
