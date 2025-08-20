"use client";

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDisplayName } from '@/types/user';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  const navigation = [
    {
      name: isRTL ? 'لوحة التحكم' : 'Dashboard',
      href: `/${locale}/dashboard`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      name: isRTL ? 'تحليل البشرة' : 'Skin Analysis',
      href: `/${locale}/dashboard/analysis`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: isRTL ? 'المنتجات' : 'Products',
      href: `/${locale}/dashboard/products`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: isRTL ? 'الطلبات' : 'Orders',
      href: `/${locale}/dashboard/orders`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: isRTL ? 'الملف الشخصي' : 'Profile',
      href: `/${locale}/dashboard/profile`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent navigation={navigation} isRTL={isRTL} user={user} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent navigation={navigation} isRTL={isRTL} user={user} onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <div className={`lg:pl-64 ${isRTL ? 'lg:pr-64 lg:pl-0' : ''}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
  }>;
  isRTL: boolean;
  user: any;
  onLogout: () => void;
}

function SidebarContent({ navigation, isRTL, user, onLogout }: SidebarContentProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      {/* Logo/Brand */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className={`ml-2 text-xl font-bold text-gray-900 ${isRTL ? 'mr-2 ml-0 font-cairo' : ''}`}>
            Skinior
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${isRTL ? 'font-cairo' : ''}`}
            >
              <span className={`mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500 ${isRTL ? 'ml-3 mr-0' : ''}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* User info */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
            <p className={`text-sm font-medium text-gray-700 ${isRTL ? 'font-cairo' : ''}`}>
              {user ? getUserDisplayName(user) : 'User'}
            </p>
            <button
              onClick={onLogout}
              className={`text-xs text-gray-500 hover:text-gray-700 ${isRTL ? 'font-cairo' : ''}`}
            >
              {isRTL ? 'تسجيل الخروج' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}