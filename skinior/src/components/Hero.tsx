"use client";

import React from "react";
import WaitlistButton from "./ui/WaitlistButton";
import { useTranslations, useLocale } from "next-intl";

const Hero = () => {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section
      className="hero relative min-h-screen flex items-center justify-center pt-20 pb-12 sm:pb-16"
      role="banner"
      aria-label="Skinior Hero Section"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        poster="/hero-poster.webp"
        aria-label={t("videoAlt")}
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
        {t("videoAlt")}
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className={`relative z-10 text-white text-center px-6 max-w-4xl mx-auto ${
          locale === "ar" ? "font-arabic" : ""
        }`}
      >
        <p className="text-sm md:text-base font-normal mb-6 opacity-90 tracking-wider uppercase animate-fade-in-up">
          {t("subtitle")}
        </p>
        <h1
          className={`text-5xl md:text-6xl lg:text-7xl font-serif mb-8 leading-tight animate-fade-in-up animation-delay-200 ${
            locale === "ar" ? "font-arabic leading-relaxed" : ""
          }`}
        >
          {t("title")}
        </h1>
        <p
          className={`text-base md:text-lg font-normal mb-8 opacity-90 tracking-wide leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-400 ${
            locale === "ar" ? "font-arabic" : ""
          }`}
        >
          {t("description")}
        </p>
        <div className="mt-8 sm:mt-10 animate-fade-in-up animation-delay-600 flex justify-center">
          <WaitlistButton variant="white" size="lg">
            <span
              className={`text-sm sm:text-base font-medium bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent ${
                locale === "ar" ? "font-arabic" : ""
              }`}
            >
              {t("joinWaitlist")}
            </span>
          </WaitlistButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;
