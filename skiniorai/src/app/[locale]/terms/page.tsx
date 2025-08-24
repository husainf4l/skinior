import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import type { Metadata } from "next";

export const dynamic = "force-static";

// Generate static paths for both locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata for terms page SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRTL = locale === "ar";
  
  const title = isRTL 
    ? "شروط الاستخدام - سكينيور"
    : "Terms of Service - Skinior";
    
  const description = isRTL
    ? "اقرأ شروط وأحكام استخدام خدمات سكينيور. حقوقك وواجباتك عند استخدام تحليل البشرة والاستشارات الجلدية المدعومة بالذكاء الاصطناعي"
    : "Read Skinior's Terms of Service. Your rights and responsibilities when using our AI-powered skin analysis and dermatology consultation services";
  
  const keywords = isRTL
    ? "شروط الاستخدام, الأحكام والشروط, حقوق المستخدم, تحليل البشرة, سكينيور"
    : "terms of service, terms and conditions, user agreement, skin analysis, liability, user rights, Skinior";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";
  const termsUrl = `${baseUrl}/${locale}/terms`;

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
      url: termsUrl,
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
      canonical: termsUrl,
      languages: {
        en: `${baseUrl}/en/terms`,
        ar: `${baseUrl}/ar/terms`,
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

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default function TermsPage({ params }: TermsPageProps) {
  const { locale } = use(params);
  const isRTL = locale === "ar";
  
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className={`text-3xl font-bold text-gray-900 mb-8 ${isRTL ? "font-cairo text-right" : "text-left"}`}>
        {isRTL ? "شروط الاستخدام" : "Terms of Service"}
      </h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Terms of Service
          </h2>
          <p className="text-gray-700 mb-4">
            By using Skinior&apos;s services, you agree to be bound by these
            terms and conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Use of Services
          </h2>
          <p className="text-gray-700 mb-4">
            You may use our skin analysis and product recommendation services
            for personal, non-commercial purposes only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. User Responsibilities
          </h2>
          <p className="text-gray-700 mb-4">
            You are responsible for providing accurate information and
            maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Disclaimer
          </h2>
          <p className="text-gray-700 mb-4">
            Our skin analysis and recommendations are for informational purposes
            only and do not constitute medical advice. Consult with healthcare
            professionals for medical concerns.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-4">
            Skinior shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Changes to Terms
          </h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. Changes will
            be effective immediately upon posting.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Contact Information
          </h2>
          <p className="text-gray-700">
            If you have any questions about these terms, please contact us
            through our website.
          </p>
        </section>
      </div>
    </div>
  );
}
