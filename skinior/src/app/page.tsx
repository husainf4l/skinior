import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Skinior",
  "description": "The world's first agentic skincare platform that learns, adapts, and evolves with you.",
  "url": "https://skinior.com",
  "logo": "https://skinior.com/logo/skinior-logo-black.png",
  "foundingDate": "2024",
  "founder": {
    "@type": "Organization",
    "name": "Roxate Ltd"
  },
  "sameAs": [
    "https://twitter.com/skinior"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "71-75 Shelton Street, Covent Garden",
    "addressLocality": "London",
    "postalCode": "WC2H 9JQ",
    "addressCountry": "GB"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Hero />
      <Features />
      <HowItWorks />
    </>
  );
}
