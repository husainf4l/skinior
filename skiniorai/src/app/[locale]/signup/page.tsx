"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const locale = useLocale();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isRTL = locale === 'ar';

  const passwordStrength = {
    hasMinLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = isRTL ? 'الاسم الأول مطلوب' : 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = isRTL ? 'الاسم الأول يجب أن يكون حرفين على الأقل' : 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = isRTL ? 'الاسم الأخير مطلوب' : 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = isRTL ? 'الاسم الأخير يجب أن يكون حرفين على الأقل' : 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = isRTL ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Email format is invalid';
    }

    if (!formData.password) {
      newErrors.password = isRTL ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (!isPasswordStrong) {
      newErrors.password = isRTL ? 'كلمة المرور ضعيفة' : 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = isRTL ? 'تأكيد كلمة المرور مطلوب' : 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = isRTL ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData.firstName, formData.lastName, formData.email, formData.password);
      router.push(`/${locale}/dashboard`); // Redirect to dashboard
    } catch (error) {
      setErrors({ 
        submit: error instanceof Error ? error.message : (isRTL ? 'فشل في إنشاء الحساب' : 'Failed to create account') 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl font-cairo' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* Form Section */}
        <div className="flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1">
          <div className="w-full max-w-md space-y-8">
            
            {/* Header */}
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
              </div>
              
              <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'إنشاء حساب جديد' : 'Create your account'}
              </h1>
              <p className={`text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'ابدأي رحلة العناية ببشرتك اليوم' : 'Start your personalized skincare journey today'}
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

              {/* First Name */}
              <div>
                <label 
                  htmlFor="firstName" 
                  className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}
                >
                  {isRTL ? 'الاسم الأول' : 'First name'}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  } ${isRTL ? 'font-cairo text-right' : ''}`}
                  placeholder={isRTL ? 'أدخلي اسمك الأول' : 'Enter your first name'}
                />
                {errors.firstName && (
                  <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'font-cairo' : ''}`}>{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label 
                  htmlFor="lastName" 
                  className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}
                >
                  {isRTL ? 'الاسم الأخير' : 'Last name'}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  } ${isRTL ? 'font-cairo text-right' : ''}`}
                  placeholder={isRTL ? 'أدخلي اسمك الأخير' : 'Enter your last name'}
                />
                {errors.lastName && (
                  <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'font-cairo' : ''}`}>{errors.lastName}</p>
                )}
              </div>

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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } ${isRTL ? 'font-cairo text-right pr-12' : 'pr-12'}`}
                    placeholder={isRTL ? 'أدخلي كلمة مرور قوية' : 'Enter a strong password'}
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckIcon className="h-3 w-3" />
                        <span className={isRTL ? 'font-cairo' : ''}>{isRTL ? '8 أحرف على الأقل' : '8+ characters'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckIcon className="h-3 w-3" />
                        <span className={isRTL ? 'font-cairo' : ''}>{isRTL ? 'حرف كبير' : 'Uppercase'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckIcon className="h-3 w-3" />
                        <span className={isRTL ? 'font-cairo' : ''}>{isRTL ? 'حرف صغير' : 'Lowercase'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckIcon className="h-3 w-3" />
                        <span className={isRTL ? 'font-cairo' : ''}>{isRTL ? 'رقم' : 'Number'}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'font-cairo' : ''}`}>{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}
                >
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm password'}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } ${isRTL ? 'font-cairo text-right pr-12' : 'pr-12'}`}
                    placeholder={isRTL ? 'أعيدي إدخال كلمة المرور' : 'Confirm your password'}
                  />
                  <button
                    type="button"
                    className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                      isRTL ? 'left-3' : 'right-3'
                    }`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'font-cairo' : ''}`}>{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={`text-sm text-gray-600 ${isRTL ? 'font-cairo text-right' : ''}`}>
                    {isRTL ? (
                      <>
                        أوافق على{' '}
                        <Link href={`/${locale}/terms`} className="text-blue-600 hover:text-blue-700 underline">
                          الشروط والأحكام
                        </Link>
                        {' '}و{' '}
                        <Link href={`/${locale}/privacy`} className="text-blue-600 hover:text-blue-700 underline">
                          سياسة الخصوصية
                        </Link>
                      </>
                    ) : (
                      <>
                        I agree to the{' '}
                        <Link href={`/${locale}/terms`} className="text-blue-600 hover:text-blue-700 underline">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href={`/${locale}/privacy`} className="text-blue-600 hover:text-blue-700 underline">
                          Privacy Policy
                        </Link>
                      </>
                    )}
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'font-cairo' : ''}`}>{errors.agreeToTerms}</p>
                )}
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
                    {isRTL ? 'جاري إنشاء الحساب...' : 'Creating account...'}
                  </div>
                ) : (
                  isRTL ? 'إنشاء حساب' : 'Create account'
                )}
              </button>
            </form>

            {/* Sign in link */}
            <div className="text-center">
              <p className={`text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'لديك حساب بالفعل؟ ' : "Already have an account? "}
                <Link 
                  href={`/${locale}/login`}
                  className={`text-blue-600 hover:text-blue-700 font-medium ${isRTL ? 'font-cairo' : ''}`}
                >
                  {isRTL ? 'تسجيل الدخول' : 'Sign in'}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Image Section - Hidden on mobile, full height on desktop */}
        <div className="hidden lg:block relative bg-gradient-to-br from-purple-50 to-blue-100 order-1 lg:order-2">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
          <Image
            src="/hero/hero2.webp"
            alt={isRTL ? "تحليل البشرة الشخصي" : "Personalized skin analysis"}
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
                {isRTL ? 'انضمي إلى آلاف النساء' : 'Join thousands of women'}
              </h2>
              <p className={`text-lg opacity-90 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL 
                  ? 'اللواتي اكتشفن أسرار جمال بشرتهن مع تقنياتنا المتطورة'
                  : 'Who have discovered their skin\'s potential with our advanced technology'
                }
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-400" />
                  <span className={isRTL ? 'font-cairo' : ''}>
                    {isRTL ? 'تحليل مجاني ومفصل' : 'Free detailed analysis'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-400" />
                  <span className={isRTL ? 'font-cairo' : ''}>
                    {isRTL ? 'توصيات شخصية' : 'Personalized recommendations'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-400" />
                  <span className={isRTL ? 'font-cairo' : ''}>
                    {isRTL ? 'متابعة مستمرة' : 'Ongoing support'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}