"use client";

interface LocalSEOProps {
  locale: string;
  businessInfo?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    hours?: string;
  };
}

export default function LocalSEO({ locale, businessInfo }: LocalSEOProps) {
  const isRTL = locale === "ar";
  
  const defaultBusinessInfo = {
    name: isRTL ? "سكينيور" : "Skinior",
    address: isRTL ? "عمان، الأردن" : "Amman, Jordan",
    phone: "+962 7 9999 9999",
    email: "info@skinior.com",
    hours: isRTL ? "الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً" : "Sunday - Thursday: 9:00 AM - 6:00 PM"
  };

  const business = { ...defaultBusinessInfo, ...businessInfo };

  // Generate Local Business Schema
  const generateLocalBusinessSchema = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";
    
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/#organization`,
      "name": business.name,
      "image": [
        `${baseUrl}/logos/skinior-logo-black.png`,
        `${baseUrl}/hero/hero1.webp`
      ],
      "description": isRTL 
        ? "منصة العناية بالبشرة المدعومة بالذكاء الاصطناعي في الأردن"
        : "AI-powered skincare analysis and consultation platform in Jordan",
      "url": baseUrl,
      "telephone": business.phone,
      "email": business.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": business.address,
        "addressLocality": isRTL ? "عمان" : "Amman",
        "addressRegion": isRTL ? "عمان" : "Amman",
        "postalCode": "11118",
        "addressCountry": "JO"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 31.9454,
        "longitude": 35.9284
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Sunday",
            "Monday", 
            "Tuesday",
            "Wednesday",
            "Thursday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/skinior",
        "https://www.instagram.com/skinior",
        "https://twitter.com/skinior"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": isRTL ? "منتجات وخدمات العناية بالبشرة" : "Skincare Products and Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": isRTL ? "تحليل البشرة بالذكاء الاصطناعي" : "AI Skin Analysis",
              "description": isRTL ? "تحليل متقدم لحالة البشرة باستخدام تقنيات الذكاء الاصطناعي" : "Advanced skin condition analysis using AI technology"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": isRTL ? "منتجات العناية بالبشرة الطبيعية" : "Natural Skincare Products",
              "description": isRTL ? "منتجات عالية الجودة للعناية بالبشرة" : "High-quality skincare products",
              "brand": {
                "@type": "Brand",
                "name": "Skinior"
              },
              "category": isRTL ? "العناية بالبشرة" : "Skincare",
              "offers": {
                "@type": "Offer",
                "price": "25.00",
                "priceCurrency": "JOD",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2025-12-31",
                "seller": {
                  "@type": "Organization",
                  "name": "Skinior"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.7",
                "reviewCount": "89",
                "bestRating": "5",
                "worstRating": "1"
              }
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "areaServed": {
        "@type": "Country",
        "name": isRTL ? "الأردن" : "Jordan"
      },
      "currenciesAccepted": "JOD",
      "paymentAccepted": [
        "Cash",
        "Credit Card",
        "PayPal"
      ]
    };
  };

  return (
    <>
      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateLocalBusinessSchema()),
        }}
      />
    </>
  );
}

// Jordan-specific keywords for different pages
export const jordanKeywords = {
  en: {
    skincare: "Jordan skincare, Amman beauty products, Jordan cosmetics, Middle East skincare, Jordanian beauty, skincare Amman",
    products: "buy skincare Jordan, order beauty products Amman, Jordan online cosmetics, skincare delivery Jordan",
    analysis: "skin analysis Jordan, AI skincare Amman, dermatology consultation Jordan, skin doctor online Jordan",
    shop: "beauty shop Jordan, skincare store Amman, cosmetics retailer Jordan, online beauty shopping Jordan"
  },
  ar: {
    skincare: "العناية بالبشرة الأردن، منتجات التجميل عمان، مستحضرات التجميل الأردن، العناية بالبشرة الشرق الأوسط، التجميل الأردني، العناية بالبشرة عمان",
    products: "شراء منتجات العناية بالبشرة الأردن، طلب منتجات التجميل عمان، مستحضرات التجميل أونلاين الأردن، توصيل منتجات البشرة الأردن",
    analysis: "تحليل البشرة الأردن، العناية بالبشرة بالذكاء الاصطناعي عمان، استشارة جلدية الأردن، طبيب جلدية أونلاين الأردن",
    shop: "متجر تجميل الأردن، متجر العناية بالبشرة عمان، بيع مستحضرات التجميل الأردن، تسوق التجميل أونلاين الأردن"
  }
};