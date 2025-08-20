"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";

const AboutPage = () => {
  const t = useTranslations("about");
  const locale = useLocale();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const isRTL = locale === "ar";

  useEffect(() => {
    setIsLoaded(true);

    // Animate stats counter
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Skinior",
    description: t("hero.description"),
    url: `https://skinior.com/${locale}/about`,
    logo: `https://skinior.com/logos/skinior-logo-${
      locale === "ar" ? "black-ar" : "black"
    }.png`,
    sameAs: [
      "https://twitter.com/skinior",
      "https://linkedin.com/company/skinior",
      "https://instagram.com/skinior",
    ],
    foundingDate: "2023",
    numberOfEmployees: "25+",
    industry: "Beauty Technology",
    slogan: t("hero.title"),
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
    offers: {
      "@type": "Service",
      name: "AI Skin Analysis",
      description: t("technology.description"),
      provider: {
        "@type": "Organization",
        name: "Skinior",
      },
    },
  };

  const stats = [
    { number: t("team.stats.0.number"), label: t("team.stats.0.label") },
    { number: t("team.stats.1.number"), label: t("team.stats.1.label") },
    { number: t("team.stats.2.number"), label: t("team.stats.2.label") },
    { number: t("team.stats.3.number"), label: t("team.stats.3.label") },
  ];

  const technologies = [
    {
      title: t("technology.features.0.title"),
      description: t("technology.features.0.description"),
    },
    {
      title: t("technology.features.1.title"),
      description: t("technology.features.1.description"),
    },
    {
      title: t("technology.features.2.title"),
      description: t("technology.features.2.description"),
    },
    {
      title: t("technology.features.3.title"),
      description: t("technology.features.3.description"),
    },
  ];

  const values = [
    {
      title: t("values.items.0.title"),
      description: t("values.items.0.description"),
    },
    {
      title: t("values.items.1.title"),
      description: t("values.items.1.description"),
    },
    {
      title: t("values.items.2.title"),
      description: t("values.items.2.description"),
    },
    {
      title: t("values.items.3.title"),
      description: t("values.items.3.description"),
    },
  ];

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main
        className={`min-h-screen bg-gradient-to-br from-slate-50 to-white ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className={`transform transition-all duration-1000 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {t("hero.title")}
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {t("hero.subtitle")}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                {t("hero.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white" aria-labelledby="mission-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div
                className={`transform transition-all duration-1000 delay-200 ${
                  isLoaded
                    ? "translate-x-0 opacity-100"
                    : `${
                        isRTL ? "translate-x-10" : "-translate-x-10"
                      } opacity-0`
                }`}
              >
                <h2
                  id="mission-title"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                >
                  {t("mission.title")}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t("mission.description")}
                </p>
              </div>
              <div
                className={`transform transition-all duration-1000 delay-400 ${
                  isLoaded
                    ? "translate-x-0 opacity-100"
                    : `${
                        isRTL ? "-translate-x-10" : "translate-x-10"
                      } opacity-0`
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      AI-Powered Innovation
                    </h3>
                    <p className="text-gray-600">
                      Cutting-edge technology meets beauty expertise
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section
          className="py-20 bg-gradient-to-br from-gray-50 to-white"
          aria-labelledby="story-title"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h2
                id="story-title"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              >
                {t("story.title")}
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                {t("story.content")}
              </p>
              <blockquote className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto border border-blue-100">
                <p className="text-lg text-gray-700 italic">
                  &ldquo;{t("story.highlight")}&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 bg-white" aria-labelledby="technology-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transform transition-all duration-1000 delay-400 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h2
                id="technology-title"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              >
                {t("technology.title")}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t("technology.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {technologies.map((tech, index) => (
                <article
                  key={index}
                  className={`transform transition-all duration-1000 ${
                    isLoaded
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {tech.title}
                    </h3>
                    <p className="text-gray-600">{tech.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Team Stats Section */}
        <section
          className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          aria-labelledby="team-title"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transform transition-all duration-1000 delay-500 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h2
                id="team-title"
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                {t("team.title")}
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {t("team.description")}
              </p>
            </div>

            <div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              role="list"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  role="listitem"
                  className={`text-center transform transition-all duration-1000 ${
                    isLoaded ? "scale-100 opacity-100" : "scale-95 opacity-0"
                  } ${currentStat === index ? "scale-105" : ""}`}
                  style={{ transitionDelay: `${700 + index * 100}ms` }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                    <div
                      className="text-4xl md:text-5xl font-bold mb-2"
                      aria-label={`${stat.number} ${stat.label}`}
                    >
                      {stat.number}
                    </div>
                    <div className="text-blue-100 text-lg">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50" aria-labelledby="values-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transform transition-all duration-1000 delay-600 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h2
                id="values-title"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              >
                {t("values.title")}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <article
                  key={index}
                  className={`transform transition-all duration-1000 ${
                    isLoaded
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-6 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white" aria-labelledby="cta-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className={`transform transition-all duration-1000 delay-700 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h2
                id="cta-title"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              >
                {t("cta.title")}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {t("cta.description")}
              </p>
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label={t("cta.button")}
              >
                {t("cta.button")}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
