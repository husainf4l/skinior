"use client";

import React from "react";
import WaitlistButton from "./ui/WaitlistButton";

const Hero = () => {
  return (
    <section
      className="hero relative min-h-screen flex items-center justify-center pt-20"
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
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-white text-center px-6 max-w-3xl mx-auto">
        <p className="text-sm md:text-base font-normal mb-4 opacity-80 tracking-wider uppercase">
          The World’s First Agentic Skincare
        </p>
        <h1 className="text-6xl md:text-7xl font-serif  mb-8">
          Your Evolving Routine.
        </h1>
        <p className="text-sm md:text-base font-normal mb-4 opacity-80 tracking-wider ">
          Learns your skin, your routine, and your lifestyle then tracks your
          results and adapts your plan over time.
        </p>
        <div className="mt-8">
          <WaitlistButton variant="white" size="md">
            <p className="text-sm font-medium bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent animate-pulse">
              Join our waitlist
            </p>
          </WaitlistButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;
