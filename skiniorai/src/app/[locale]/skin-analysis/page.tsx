"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SkinAnalysisPage() {
  const currentLocale = useLocale();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isRTL = currentLocale === 'ar';

  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % 4);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🔬",
      title: isRTL ? "تحليل متقدم للبشرة" : "Advanced Skin Analysis",
      description: isRTL ? "تكنولوجيا الذكاء الاصطناعي لتحليل دقيق لحالة بشرتك" : "AI-powered technology for precise skin condition analysis"
    },
    {
      icon: "🎯",
      title: isRTL ? "توصيات مخصصة" : "Personalized Recommendations",
      description: isRTL ? "خطط علاج مخصصة بناءً على احتياجات بشرتك الفريدة" : "Customized treatment plans based on your unique skin needs"
    },
    {
      icon: "📊",
      title: isRTL ? "تتبع التقدم" : "Progress Tracking",
      description: isRTL ? "مراقبة تحسن بشرتك مع مرور الوقت" : "Monitor your skin improvement over time"
    },
    {
      icon: "👩‍⚕️",
      title: isRTL ? "استشارة ذكية" : "Smart Consultation",
      description: isRTL ? "مستشار ذكي متاح على مدار الساعة" : "24/7 AI beauty advisor at your service"
    }
  ];

  const benefits = [
    {
      number: "94%",
      label: isRTL ? "معدل النجاح" : "Success Rate",
      description: isRTL ? "من المستخدمين يشهدون تحسناً ملحوظاً" : "of users see noticeable improvement"
    },
    {
      number: "10K+",
      label: isRTL ? "تحليل مكتمل" : "Analyses Completed",
      description: isRTL ? "تحليل ناجح للبشرة" : "successful skin analyses"
    },
    {
      number: "24/7",
      label: isRTL ? "دعم متواصل" : "Always Available",
      description: isRTL ? "استشارة فورية في أي وقت" : "instant consultation anytime"
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push(`/${currentLocale}/dashboard`);
    } else {
      router.push(`/${currentLocale}/login`);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative container mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <span className="mr-2">✨</span>
                  {isRTL ? 'تكنولوجيا الذكاء الاصطناعي المتطورة' : 'Advanced AI Technology'}
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {isRTL ? (
                    <>
                      اكتشفي <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">إمكانيات بشرتك</span> الحقيقية
                    </>
                  ) : (
                    <>
                      Discover Your Skin&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">True Potential</span>
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  {isRTL 
                    ? 'تكنولوجيا متطورة لتحليل البشرة باستخدام الذكاء الاصطناعي. احصلي على توصيات مخصصة وخطة علاج مثالية لبشرتك.'
                    : 'Revolutionary AI-powered skin analysis technology. Get personalized recommendations and the perfect treatment plan for your skin.'
                  }
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isAuthenticated 
                    ? (isRTL ? 'اذهبي إلى لوحة التحكم' : 'Go to Dashboard')
                    : (isRTL ? 'ابدئي الآن' : 'Get Started')
                  }
                </button>
                
                {!isAuthenticated && (
                  <Link
                    href={`/${currentLocale}/signup`}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                  >
                    {isRTL ? 'إنشاء حساب' : 'Create Account'}
                  </Link>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">{isRTL ? 'متاح الآن' : 'Available Now'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{isRTL ? 'آمن وموثوق' : 'Secure & Trusted'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{isRTL ? 'نتائج فورية' : 'Instant Results'}</span>
                </div>
              </div>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                {/* Animated Skin Analysis Demo */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {isRTL ? 'تحليل البشرة الذكي' : 'Smart Skin Analysis'}
                    </h3>
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentStep === step ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden">
                    {/* Animated Analysis Steps */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                      isAnimating ? 'opacity-0' : 'opacity-100'
                    }`}>
                      {currentStep === 0 && (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔍</span>
                          </div>
                          <p className="text-gray-700 font-medium">
                            {isRTL ? 'جاري تحليل البشرة...' : 'Analyzing skin...'}
                          </p>
                        </div>
                      )}
                      
                      {currentStep === 1 && (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📊</span>
                          </div>
                          <p className="text-gray-700 font-medium">
                            {isRTL ? 'تحديد المشاكل...' : 'Identifying issues...'}
                          </p>
                        </div>
                      )}
                      
                      {currentStep === 2 && (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">💡</span>
                          </div>
                          <p className="text-gray-700 font-medium">
                            {isRTL ? 'إنشاء التوصيات...' : 'Creating recommendations...'}
                          </p>
                        </div>
                      )}
                      
                      {currentStep === 3 && (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✅</span>
                          </div>
                          <p className="text-gray-700 font-medium">
                            {isRTL ? 'خطة العلاج جاهزة!' : 'Treatment plan ready!'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{isRTL ? 'دقة التحليل: 98%' : 'Analysis Accuracy: 98%'}</span>
                    <span>{isRTL ? 'الوقت: 30 ثانية' : 'Time: 30 seconds'}</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isRTL ? 'لماذا تختارين تحليل البشرة الذكي؟' : 'Why Choose Smart Skin Analysis?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isRTL 
                ? 'تكنولوجيا متطورة تجمع بين الذكاء الاصطناعي والخبرة الطبية لتقديم أفضل النتائج'
                : 'Advanced technology combining AI and medical expertise for the best results'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">{benefit.number}</div>
                <div className="text-xl font-semibold mb-2">{benefit.label}</div>
                <div className="text-blue-100">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {isRTL ? 'جاهزة لبدء رحلة العناية ببشرتك؟' : 'Ready to Start Your Skincare Journey?'}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {isRTL 
                ? 'انضمي إلى آلاف النساء اللواتي اكتشفن إمكانيات بشرتهن الحقيقية'
                : 'Join thousands of women who have discovered their skin\'s true potential'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isAuthenticated 
                  ? (isRTL ? 'اذهبي إلى لوحة التحكم' : 'Go to Dashboard')
                  : (isRTL ? 'ابدئي التحليل الآن' : 'Start Analysis Now')
                }
              </button>
              
              {!isAuthenticated && (
                <Link
                  href={`/${currentLocale}/signup`}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  {isRTL ? 'إنشاء حساب مجاني' : 'Create Free Account'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}