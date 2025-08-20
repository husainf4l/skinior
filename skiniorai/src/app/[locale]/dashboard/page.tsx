"use client";

import React from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function DashboardPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <DashboardLayout>
      <div className={`p-6 ${isRTL ? 'font-cairo text-right' : ''}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
              {isRTL ? 'مرحباً بك في لوحة التحكم' : 'Welcome to Dashboard'}
            </h1>
            <p className={`text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
              {isRTL ? 'إدارة حسابك وتتبع رحلة العناية ببشرتك' : 'Manage your account and track your skincare journey'}
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                  <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'تحليلات البشرة' : 'Skin Analyses'}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                  <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'المنتجات المفضلة' : 'Favorite Products'}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                  <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'الطلبات' : 'Orders'}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                  <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'النقاط' : 'Points'}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className={`text-lg font-medium text-gray-900 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
              {isRTL ? 'مرحباً بك في Skinior' : 'Welcome to Skinior'}
            </h3>
            <p className={`text-gray-500 max-w-md mx-auto ${isRTL ? 'font-cairo' : ''}`}>
              {isRTL 
                ? 'ابدأي رحلة العناية ببشرتك. قومي بإجراء تحليل للبشرة أو تصفحي منتجاتنا المميزة'
                : 'Start your skincare journey. Take a skin analysis or browse our featured products'
              }
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href={`/${locale}/room-test`}
                className={`bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors text-center ${isRTL ? 'font-cairo' : ''}`}
              >
                {isRTL ? 'استشارة الذكاء الاصطناعي' : 'AI Consultation'}
              </Link>
              <button className={`border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}