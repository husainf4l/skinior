"use client";

import React from "react";
import WaitlistButton from "./ui/WaitlistButton";

const HowItWorks = () => {
  return (
    <section
      className="py-24 bg-gray-50"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="lg:pr-8">
            <video
              className="w-full aspect-square object-cover rounded-2xl"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            >
              <source src="/works.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 tracking-tight">
              How Skinior Works
            </h2>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-sm">
                Experience the future of skincare with our simple, AI-powered
                process that evolves with you.
              </p>

              <p className="text-sm">
                Begin with our{" "}
                <span className="text-gray-900 font-medium">
                  skin assessment
                </span>{" "}
                — a quick analysis to understand your unique skin type and
                concerns. Our intelligent system captures every detail that
                matters.
              </p>

              <p className="text-sm">
                Our{" "}
                <span className="text-gray-900 font-medium">agentic AI</span>{" "}
                then analyzes your data, lifestyle patterns, and environmental
                factors to create a truly personalized skincare routine tailored
                specifically for you.
              </p>

              <p className="text-sm">
                As you use Skinior, we continuously{" "}
                <span className="text-gray-900 font-medium">
                  track and adapt
                </span>{" "}
                your routine. Your skin&apos;s progress is monitored, and our AI
                evolves your care as your needs change.
              </p>

              <p className="text-sm">
                The result?{" "}
                <span className="text-gray-900 font-medium">
                  Healthier, glowing skin
                </span>{" "}
                with routines that grow smarter every day, delivering results
                that adapt to your unique beauty journey.
              </p>
            </div>

            <div className="mt-10">
              <WaitlistButton variant="primary" size="md">
                Join Waiting List
              </WaitlistButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
