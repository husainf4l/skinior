"use client";

import React from "react";
import WaitlistButton from "./ui/WaitlistButton";

const Features = () => {
  return (
    <section className="py-24 bg-white" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 tracking-tight">
              Where Beauty Meets Intelligence
            </h2>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-sm">
                Skinior is not a routine. It&apos;s an agentic intelligence that
                evolves with you — understanding your skin, your lifestyle, and
                your unique beauty journey.
              </p>

              <p className="text-sm">
                <span className="text-gray-900 font-medium">
                  Adaptive Intelligence
                </span>{" "}
                learns your skin with every touchpoint, improving with every
                interaction.{" "}
                <span className="text-gray-900 font-medium">
                  Precision Personalisation
                </span>{" "}
                tailors your care uniquely to you, from hydration to tone.
              </p>

              <p className="text-sm">
                Your sleep, your environment, your habits — all mapped, all
                understood through{" "}
                <span className="text-gray-900 font-medium">
                  Lifestyle Synchronisation
                </span>
                . With every moment, it adapts, refines, and perfects through{" "}
                <span className="text-gray-900 font-medium">
                  Progressive Perfection
                </span>
                .
              </p>

              <p className="text-sm">
                <span className="text-gray-900 font-medium">
                  Privacy at Its Core
                </span>{" "}
                ensures your data stays secured. Your beauty, exclusively yours.
              </p>
            </div>

            <div className="mt-10">
              <WaitlistButton variant="primary" size="md" />
            </div>
          </div>

          <div className="lg:pl-8 hidden md:block">
            <video
              className="w-full aspect-square object-cover rounded-2xl"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            >
              <source src="/feature.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
