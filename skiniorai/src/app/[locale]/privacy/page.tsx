import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import type { Metadata } from "next";

export const dynamic = "force-static";

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata for privacy page SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRTL = locale === "ar";
  
  const title = isRTL 
    ? "سياسة الخصوصية - سكينيور"
    : "Privacy Policy - Skinior";
    
  const description = isRTL
    ? "اطلع على سياسة الخصوصية الخاصة بسكينيور. كيف نجمع ونستخدم ونحمي بياناتك الشخصية ومعلومات تحليل البشرة بأمان وشفافية"
    : "Read Skinior's Privacy Policy. Learn how we collect, use, and protect your personal data and skin analysis information with safety and transparency";
  
  const keywords = isRTL
    ? "سياسة الخصوصية, حماية البيانات, الأمان, المعلومات الشخصية, تحليل البشرة, سكينيور"
    : "privacy policy, data protection, security, personal information, skin analysis, GDPR, user rights, Skinior";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";
  const privacyUrl = `${baseUrl}/${locale}/privacy`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Skinior Legal Team" }],
    creator: "Skinior",
    publisher: "Skinior",
    category: "Legal",
    metadataBase: new URL(baseUrl),
    
    openGraph: {
      title,
      description,
      url: privacyUrl,
      siteName: "Skinior",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "article",
    },
    
    twitter: {
      card: "summary",
      title,
      description,
      site: "@skinior",
    },
    
    alternates: {
      canonical: privacyUrl,
      languages: {
        en: `${baseUrl}/en/privacy`,
        ar: `${baseUrl}/ar/privacy`,
      },
    },
    
    robots: {
      index: true,
      follow: true,
      noarchive: false,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = use(params);
  const isRTL = locale === "ar";
  
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className={`text-3xl font-bold text-gray-900 mb-8 ${isRTL ? "font-cairo text-right" : "text-left"}`}>
        {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
      </h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            We collect information you provide directly to us, such as when you
            create an account, use our skin analysis service, or contact us for
            support.
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Personal information (name, email, phone number)</li>
            <li>Skin analysis photos and data</li>
            <li>Usage information and preferences</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Provide and improve our skin analysis services</li>
            <li>Send you personalized product recommendations</li>
            <li>Communicate with you about our services</li>
            <li>Ensure the security of our platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Information Sharing
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            described in this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Data Security
          </h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Your Rights
          </h2>
          <p className="text-gray-700 mb-4">
            You have the right to access, update, or delete your personal
            information. You may also opt out of certain communications from us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Cookies and Tracking
          </h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to enhance your
            experience and analyze how our services are used.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Children&apos;s Privacy
          </h2>
          <p className="text-gray-700 mb-4">
            Our services are not intended for children under 13. We do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions about this privacy policy, please contact
            us through our website or support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
