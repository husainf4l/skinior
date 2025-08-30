import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PrivacyNoticePortal from "../components/PrivacyNoticePortal";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <PrivacyNoticePortal />
        </AuthProvider>
      </body>
    </html>
  );
}
