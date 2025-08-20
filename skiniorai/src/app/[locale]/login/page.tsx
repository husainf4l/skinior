"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isRTL = locale === 'ar';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = isRTL ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Email format is invalid';
    }

    if (!formData.password) {
      newErrors.password = isRTL ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push(`/${locale}/dashboard`); // Redirect to dashboard
    } catch (error) {
      setErrors({ 
        submit: error instanceof Error ? error.message : (isRTL ? 'فشل في تسجيل الدخول' : 'Login failed') 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl font-cairo' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* Image Section - Hidden on mobile, full height on desktop */}
        <div className="hidden lg:block relative bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <Image
            src="/hero/hero1.webp"
            alt={isRTL ? "تحليل البشرة المتقدم" : "Advanced skin analysis"}
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 flex items-end p-12">
            <div className="text-white max-w-md">
              <h2 className={`text-3xl font-bold mb-4 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'اكتشفي إمكانيات بشرتك الحقيقية' : 'Discover Your Skin\'s True Potential'}
              </h2>
              <p className={`text-lg opacity-90 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL 
                  ? 'تكنولوجيا متطورة لتحليل البشرة وتقديم حلول مخصصة لك'
                  : 'Advanced AI technology for personalized skincare analysis and recommendations'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            
            {/* Header */}
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
              </div>
              
              <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'مرحباً بعودتك' : 'Welcome back'}
              </h1>
              <p className={`text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'سجلي دخولك لمتابعة رحلة العناية ببشرتك' : 'Sign in to continue your skincare journey'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}
                >
                  {isRTL ? 'البريد الإلكتروني' : 'Email address'}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } ${isRTL ? 'font-cairo text-right' : ''}`}
                  placeholder={isRTL ? 'أدخلي بريدك الإلكتروني' : 'Enter your email'}
                />
                {errors.email && (
                  <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'font-cairo' : ''}`}>{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label 
                  htmlFor="password" 
                  className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}
                >
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } ${isRTL ? 'font-cairo text-right pr-12' : 'pr-12'}`}
                    placeholder={isRTL ? 'أدخلي كلمة المرور' : 'Enter your password'}
                  />
                  <button
                    type="button"
                    className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                      isRTL ? 'left-3' : 'right-3'
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'font-cairo' : ''}`}>{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                <Link 
                  href={`/${locale}/forgot-password`}
                  className={`text-sm text-blue-600 hover:text-blue-700 ${isRTL ? 'font-cairo' : ''}`}
                >
                  {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                  isRTL ? 'font-cairo' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                  </div>
                ) : (
                  isRTL ? 'تسجيل الدخول' : 'Sign in'
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="text-center">
              <p className={`text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
                <Link 
                  href={`/${locale}/signup`}
                  className={`text-blue-600 hover:text-blue-700 font-medium ${isRTL ? 'font-cairo' : ''}`}
                >
                  {isRTL ? 'إنشاء حساب جديد' : 'Sign up'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}