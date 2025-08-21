"use client";

import { useLocale } from "next-intl";
import { memo, useState, useEffect } from "react";
import Image from "next/image";
import { API_CONFIG } from '@/lib/config';

interface Deal {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number;
  discountPercentage: number;
  images: string[];
  category: string;
  availability: boolean;
}

const TodaysDeals = memo(() => {
  const locale = useLocale();
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const isRTL = locale === "ar";

  // Fetch deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`${API_CONFIG.API_BASE_URL}/products/deals/today`);
        
        if (!response.ok) {
          console.error(`Today's deals API error: ${response.status} ${response.statusText}`);
          return;
        }
        
        const responseData = await response.json();
        
        let dealsData: Deal[] = [];
        if (responseData.success && Array.isArray(responseData.data)) {
          dealsData = responseData.data;
        } else if (Array.isArray(responseData)) {
          dealsData = responseData;
        }
        
        // Filter available deals and sort by discount percentage
        console.log('Raw deals data:', dealsData);
        const activeDeals = dealsData
          .filter(deal => {
            console.log(`Deal ${deal.name}: availability=${deal.availability}, discount=${deal.discountPercentage}`);
            return deal.availability && (deal.discountPercentage > 0 || deal.compareAtPrice > deal.price);
          })
          .sort((a, b) => b.discountPercentage - a.discountPercentage);
        
        console.log('Filtered active deals:', activeDeals);
        setDeals(activeDeals);
      } catch (error) {
        console.error('Error fetching today\'s deals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchDeals();
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-rotate deals every 6 seconds
  useEffect(() => {
    if (!mounted || deals.length === 0) return;
    
    console.log('Setting up auto-rotation for', deals.length, 'deals');
    const interval = setInterval(() => {
      setCurrentDealIndex((prev) => {
        const next = (prev + 1) % deals.length;
        console.log('Auto-rotating from deal', prev, 'to deal', next);
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [mounted, deals.length]);

  if (!mounted || loading || deals.length === 0) {
    return null;
  }

  return (
    <section
      className={`py-20 bg-white/70 backdrop-blur-2xl ${isRTL ? "rtl font-cairo" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Debug Info - Remove in production */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="bg-gray-100 p-4 rounded text-sm">
          <strong>Debug:</strong> Total deals: {deals.length}, Current index: {currentDealIndex}, Loading: {loading ? 'true' : 'false'}
          {deals.map((deal, i) => (
            <div key={deal.id}>Deal {i}: {deal.name} (discount: {deal.discountPercentage}%)</div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Skinior Style */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
            <span className="text-sm font-medium text-gray-700 tracking-wider uppercase">
              {isRTL ? "عروض اليوم" : "Today's Deals"}
            </span>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full ml-2" />
          </div>
          <h2 className={`text-4xl lg:text-5xl font-light text-gray-900 leading-tight ${isRTL ? "font-cairo" : ""}`}>
            {isRTL ? "عروض حصرية لفترة محدودة" : "Limited Time Exclusive Offers"}
          </h2>
          <p className={`mt-4 text-lg text-gray-600 max-w-2xl mx-auto ${isRTL ? "font-cairo leading-relaxed" : "leading-relaxed"}`}>
            {isRTL 
              ? "اكتشفي أفضل العروض المحدودة على منتجات العناية المختارة"
              : "Discover exclusive limited-time offers on selected skincare essentials"
            }
          </p>
        </div>

        {/* Main Deal Carousel - Skinior Style */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-gray-900/10">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${isRTL ? currentDealIndex * 100 : -currentDealIndex * 100}%)` }}
          >
            {deals.map((deal, index) => (
              <div
                key={deal.id}
                className="w-full flex-shrink-0"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[400px] ${isRTL ? "lg:grid-flow-col-dense" : ""}`}>
                  {/* Deal Content - Skinior Style */}
                  <div className={`flex flex-col justify-center p-8 lg:p-16 ${isRTL ? "lg:order-2" : "order-2 lg:order-1"}`}>
                    {/* Discount Badge - Skinior Style */}
                    <div className="mb-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        <span className="uppercase tracking-wider">{deal.discountPercentage}% OFF</span>
                      </div>
                    </div>

                    {/* Deal Title - Skinior Style */}
                    <h3 className={`text-3xl lg:text-4xl font-light text-gray-900 mb-6 leading-tight ${isRTL ? "font-cairo" : ""}`}>
                      {deal.name}
                    </h3>

                    {/* Deal Description - Skinior Style */}
                    <p className={`text-xl text-gray-600 mb-8 leading-relaxed ${isRTL ? "font-cairo" : ""}`}>
                      {isRTL ? `وفر ${deal.discountPercentage}% على ${deal.category}` : `Save ${deal.discountPercentage}% on ${deal.category}`}
                    </p>

                    {/* Price Display */}
                    <div className="mb-8">
                      <div className={`flex items-baseline gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span className={`text-2xl font-semibold text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                          {isRTL ? `${deal.price.toFixed(2)} د.أ` : `JOD ${deal.price.toFixed(2)}`}
                        </span>
                        <span className={`text-lg text-gray-500 line-through ${isRTL ? "font-cairo" : ""}`}>
                          {isRTL ? `${deal.compareAtPrice.toFixed(2)} د.أ` : `JOD ${deal.compareAtPrice.toFixed(2)}`}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button - Skinior Style */}
                    <div>
                      <button
                        onClick={() => window.location.href = `/${locale}/products/${deal.id}`}
                        className={`bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200 hover:scale-105 ${isRTL ? "font-cairo" : ""}`}
                      >
                        {isRTL ? "تسوق الآن" : "Shop Now"}
                      </button>
                      <p className={`mt-3 text-sm text-gray-500 ${isRTL ? "font-cairo" : ""}`}>
                        {isRTL ? "عرض محدود • بينما تتوفر الكمية" : "Limited time • While supplies last"}
                      </p>
                    </div>
                  </div>

                  {/* Deal Image - Skinior Style */}
                  <div className={`relative ${isRTL ? "lg:order-1" : "order-1 lg:order-2"}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/5" />
                    <Image
                      src={deal.images[0] || "/product-holder.webp"}
                      alt={deal.name}
                      fill
                      className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots - Skinior Style */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {deals.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log('Clicked dot', index, 'current was', currentDealIndex);
                  setCurrentDealIndex(index);
                }}
                className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center ${
                  index === currentDealIndex
                    ? "bg-white/90 shadow-md"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to deal ${index + 1}`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentDealIndex
                      ? "bg-gray-900"
                      : "bg-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Navigation Arrows - Skinior Style */}
          <button
            onClick={() => {
              const newIndex = (currentDealIndex - 1 + deals.length) % deals.length;
              console.log('Previous arrow: from', currentDealIndex, 'to', newIndex);
              setCurrentDealIndex(newIndex);
            }}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-xl hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110 ${
              isRTL ? "right-6" : "left-6"
            }`}
            aria-label="Previous deal"
          >
            <svg className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => {
              const newIndex = (currentDealIndex + 1) % deals.length;
              console.log('Next arrow: from', currentDealIndex, 'to', newIndex);
              setCurrentDealIndex(newIndex);
            }}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-xl hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110 ${
              isRTL ? "left-6" : "right-6"
            }`}
            aria-label="Next deal"
          >
            <svg className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Quick Deal Cards - Skinior Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {deals.slice(0, 3).map((deal, index) => (
            <div
              key={`quick-${deal.id}`}
              className="group bg-white/80 backdrop-blur-2xl border border-white/20 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-black/5 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 ease-out overflow-hidden cursor-pointer"
              onClick={() => setCurrentDealIndex(index)}
            >
              <div className="relative h-40">
                <Image
                  src={deal.images[0] || "/product-holder.webp"}
                  alt={deal.name}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={75}
                />
                <div className={`absolute top-3 ${isRTL ? "right-3" : "left-3"}`}>
                  <div className="px-2 py-1 bg-gray-900/90 backdrop-blur-xl text-white text-xs font-medium rounded-md">
                    {deal.discountPercentage}% OFF
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h4 className={`font-medium text-gray-900 text-sm mb-2 line-clamp-1 ${isRTL ? "font-cairo text-right" : "text-left"}`}>
                  {deal.name}
                </h4>
                <p className={`text-gray-600 text-xs line-clamp-2 ${isRTL ? "font-cairo text-right" : "text-left"}`}>
                  {isRTL ? `وفر ${deal.discountPercentage}% على ${deal.category}` : `Save ${deal.discountPercentage}% on ${deal.category}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TodaysDeals.displayName = "TodaysDeals";

export default TodaysDeals;