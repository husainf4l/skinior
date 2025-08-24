"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useState,
  useEffect,
  useCallback,
  startTransition,
  useMemo,
} from "react";

const HeroSection = () => {
  const locale = useLocale();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isRTL = locale === "ar";

  // Detect mobile device for optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Memoize hero images with mobile prioritization
  const heroImages = useMemo(
    () => ["/hero/hero1.webp", "/hero/hero2.webp"],
    []
  );

  // Memoize scroll handler to prevent recreating function
  const handleScrollToNext = useCallback(() => {
    const nextSection =
      document.querySelector("#features") ||
      document.querySelector("section:nth-of-type(2)") ||
      document.querySelector("main > *:nth-child(2)");
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Fallback: scroll by viewport height
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Handle navigation to room page
  const handleGetAnalysis = useCallback(() => {
    router.push(`/${locale}/room`);
  }, [router, locale]);

  // Optimized mouse move handler - disabled on mobile for performance
  useEffect(() => {
    if (!isLoaded || isMobile) return; // Skip on mobile for better performance

    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        startTransition(() => {
          setMousePosition({
            x: (e.clientX / window.innerWidth) * 100,
            y: (e.clientY / window.innerHeight) * 100,
          });
        });
      }, 16); // 60fps throttling
    };

    // Delay mouse move listener to not interfere with LCP
    const loadTimeoutId = setTimeout(() => {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }, 3000); // Wait 3 seconds after component load

    return () => {
      clearTimeout(loadTimeoutId);
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isLoaded, isMobile]);

  // Mark as loaded after mount to enable interactions
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Optimized image carousel - longer intervals on mobile
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(
      () => {
        startTransition(() => {
          setCurrentImageIndex(
            (prevIndex) => (prevIndex + 1) % heroImages.length
          );
        });
      },
      isMobile ? 8000 : 6000
    ); // Longer intervals on mobile for better performance

    return () => clearInterval(interval);
  }, [heroImages.length, isLoaded, isMobile]);

  return (
    <section
      className={`hero-section relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white ${
        isRTL ? "rtl font-cairo" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Optimized Background - only render if loaded */}
      {isLoaded && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-blue-50/20 will-change-transform"
            style={{
              transform: `translate3d(${mousePosition.x * 0.01}px, ${
                mousePosition.y * 0.01
              }px, 0)`,
            }}
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            isRTL ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {/* Text Content */}
          <div
            className={`space-y-8 ${
              isRTL
                ? "lg:order-2 text-center lg:text-right"
                : "order-2 lg:order-1 text-center lg:text-left"
            }`}
          >
            {/* Badge */}
            <div className="opacity-100">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 ${
                  isRTL ? "flex-row-reverse font-cairo" : ""
                }`}
              >
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>
                  {isRTL
                    ? "جديد: تحليل ذكي متطور"
                    : "New: Advanced AI Analysis"}
                </span>
              </div>
            </div>

            {/* Main Headline - More focused and minimal */}
            <div className="space-y-4">
              <h1
                className={`${
                  isRTL
                    ? "text-4xl lg:text-6xl font-cairo font-light text-gray-900 leading-tight"
                    : "text-4xl lg:text-6xl font-light text-gray-900 leading-tight tracking-tight"
                }`}
              >
                {isRTL ? (
                  <>
                    <span className="block mb-1">اكتشفي إشراقة</span>
                    <span className="block text-blue-600 font-normal">
                      بشرتك الحقيقية
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block mb-1">Discover your</span>
                    <span className="block text-blue-600 font-normal">
                      skin&apos;s true potential
                    </span>
                  </>
                )}
              </h1>

              <p
                className={`text-lg lg:text-xl text-gray-600 max-w-lg ${
                  isRTL
                    ? "font-cairo leading-relaxed mx-auto lg:mx-0"
                    : "leading-relaxed mx-auto lg:mx-0"
                }`}
              >
                {isRTL
                  ? "تكنولوجيا متقدمة تحلل بشرتك بدقة علمية وتقدم لك خطة عناية شخصية مصممة خصيصاً لتحقيق أفضل النتائج"
                  : "Advanced technology analyzes your skin with scientific precision, delivering a personalized skincare roadmap designed for your best results"}
              </p>
            </div>

            {/* Single focused CTA */}
            <div>
              <button
                onClick={handleGetAnalysis}
                className={`bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-medium hover:opacity-90 focus:outline-none transition-all duration-200 hover:scale-105 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "احصلي على تحليلك المجاني" : "Get Your Free Analysis"}
              </button>

              <p
                className={`mt-3 text-sm text-gray-500 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "تحليل شامل • نتائج فورية • توصيات مخصصة"
                  : "Complete analysis • Instant results • Custom recommendations"}
              </p>
            </div>

            {/* Minimal Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div
                className={`text-center ${
                  isRTL ? "lg:text-right" : "lg:text-left"
                }`}
              >
                <div className="text-2xl font-light text-gray-900 mb-1">
                  98%
                </div>
                <div
                  className={`text-xs text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "دقة" : "Accuracy"}
                </div>
              </div>
              <div
                className={`text-center ${
                  isRTL ? "lg:text-right" : "lg:text-left"
                }`}
              >
                <div className="text-2xl font-light text-gray-900 mb-1">
                  2M+
                </div>
                <div
                  className={`text-xs text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "تحليل" : "Analyses"}
                </div>
              </div>
              <div
                className={`text-center ${
                  isRTL ? "lg:text-right" : "lg:text-left"
                }`}
              >
                <div className="text-2xl font-light text-gray-900 mb-1">
                  30s
                </div>
                <div
                  className={`text-xs text-gray-600 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "سرعة" : "Speed"}
                </div>
              </div>
            </div>
          </div>

          {/* Optimized Image Section */}
          <div
            className={`relative ${
              isRTL ? "lg:order-1" : "order-1 lg:order-2"
            }`}
          >
            <div className="relative aspect-[3/4] max-w-sm lg:max-w-md mx-auto">
              {/* Clean Image Container with performance optimizations */}
              <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10 bg-white will-change-contents">
                {/* Primary hero image - mobile-optimized for Speed Index */}
                <Image
                  src={heroImages[0]}
                  alt={
                    isRTL
                      ? "تحليل احترافي للبشرة"
                      : "Professional skin analysis"
                  }
                  fill
                  className="object-cover object-center transition-opacity duration-500"
                  priority
                  loading="eager"
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 40vw, 35vw"
                  quality={85} // Optimized quality for LCP
                  fetchPriority="high"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />

                {/* Secondary images - loaded with lower priority */}
                {isLoaded &&
                  heroImages.slice(1).map((imageSrc, index) => (
                    <Image
                      key={imageSrc}
                      src={imageSrc}
                      alt={
                        isRTL
                          ? "تحليل احترافي للبشرة"
                          : "Professional skin analysis"
                      }
                      fill
                      className={`object-cover object-center transition-opacity duration-500 ${
                        index + 1 === currentImageIndex
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0"
                      }`}
                      loading="lazy"
                      sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      quality={isMobile ? 60 : 70} // Lower quality for secondary images
                      fetchPriority="low"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  ))}

                {/* Subtle overlay - only render if loaded */}
                {isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-20" />
                )}
              </div>

              {/* Optimized floating indicator */}
              <div
                className={`absolute top-4 lg:top-6 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-full shadow-lg z-30 ${
                  isRTL
                    ? "right-4 lg:right-6 flex-row-reverse"
                    : "left-4 lg:left-6"
                }`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span
                  className={`text-xs font-medium text-gray-800 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "تحليل نشط" : "Analyzing"}
                </span>
              </div>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center ${
                      index === currentImageIndex
                        ? "bg-white/90 shadow-md"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-gray-900"
                          : "bg-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal scroll indicator */}
      <button
        onClick={handleScrollToNext}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-40 hover:opacity-80 focus:outline-none group"
        aria-label={isRTL ? "انتقل للأسفل" : "Scroll down"}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gray-300 group-hover:bg-gray-400" />
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
    </section>
  );
};

export default HeroSection;
