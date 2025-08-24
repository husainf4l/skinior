"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";

  // Generate structured data for breadcrumbs
  const generateBreadcrumbStructuredData = () => {
    const itemListElement = items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.href && { "item": `${baseUrl}${item.href}` })
    }));

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElement
    };
  };

  if (items.length <= 1) return null;

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData()),
        }}
      />
      
      <nav 
        className={`flex ${isRTL ? "flex-row-reverse" : ""} ${className}`}
        aria-label={isRTL ? "مسار التنقل" : "Breadcrumb"}
      >
        <ol className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className={`w-4 h-4 text-gray-400 mx-2 ${isRTL ? "rotate-180" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className={`text-sm text-gray-500 hover:text-gray-700 transition-colors ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={`text-sm font-medium text-gray-900 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                  aria-current={index === items.length - 1 ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}