"use client";

import React from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function DashboardPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const upcomingAppointments = [
    {
      id: 'apt-001',
      date: '2024-01-25',
      time: '10:30 AM',
      type: 'Follow-up Consultation',
      advisor: 'Dr. AI Skincare Specialist',
      status: 'confirmed',
      duration: 30,
      focus: 'Acne Treatment Progress Review'
    },
    {
      id: 'apt-002',
      date: '2024-01-28',
      time: '2:00 PM',
      type: 'Routine Check-in',
      advisor: 'Dr. AI Skincare Specialist',
      status: 'pending',
      duration: 15,
      focus: 'Monthly Skin Assessment'
    }
  ];

  const activeTreatments = [
    {
      id: 'treatment-001',
      name: 'Acne Clearing Protocol',
      startDate: '2024-01-01',
      duration: '12 weeks',
      progress: 65,
      nextMilestone: 'Week 8 Assessment',
      status: 'active'
    },
    {
      id: 'treatment-002',
      name: 'Pore Minimizing Routine',
      startDate: '2024-01-10',
      duration: '8 weeks',
      progress: 40,
      nextMilestone: 'Week 4 Review',
      status: 'active'
    }
  ];

  const consultationHistory = [
    {
      date: '2024-01-15',
      type: 'Comprehensive Skin Analysis',
      advisor: 'Dr. AI Skincare Specialist',
      concerns: ['Acne', 'Large Pores'],
      recommendations: 3,
      followUpDate: '2024-01-25'
    },
    {
      date: '2024-01-08',
      type: 'Quick Consultation',
      advisor: 'Dr. AI Skincare Specialist',
      concerns: ['Blackheads'],
      recommendations: 2,
      followUpDate: '2024-01-28'
    }
  ];

  const aiAdvisorStats = {
    totalConsultations: 12,
    activeTreatments: 2,
    successRate: 94,
    avgImprovementTime: '6 weeks'
  };

  return (
    <DashboardLayout>
      <div className={`p-8 ${isRTL ? 'font-cairo text-right' : ''}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className={`text-4xl font-semibold text-gray-900 mb-3 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'مرحباً بك، سارة' : 'Good morning, Sarah'}
                </h1>
                <p className={`text-lg text-gray-600 mb-4 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'مستشارك الذكي للجمال يتابع تقدمك' : 'Your AI Beauty Advisor is tracking your progress'}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className={`text-sm text-gray-700 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'متاح للاستشارة الآن' : 'Available for consultation'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisor Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-gray-500 mb-1 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'الاستشارات الكاملة' : 'Total Consultations'}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">{aiAdvisorStats.totalConsultations}</p>
                  <p className="text-xs text-green-600 mt-1">+3 this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-gray-500 mb-1 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'الخطط النشطة' : 'Active Treatments'}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">{aiAdvisorStats.activeTreatments}</p>
                  <p className="text-xs text-blue-600 mt-1">On track</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-gray-500 mb-1 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'معدل النجاح' : 'Success Rate'}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">{aiAdvisorStats.successRate}%</p>
                  <p className="text-xs text-purple-600 mt-1">Above average</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-gray-500 mb-1 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'متوسط التحسن' : 'Avg Improvement'}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">{aiAdvisorStats.avgImprovementTime}</p>
                  <p className="text-xs text-orange-600 mt-1">Faster than usual</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Upcoming Appointments & Active Treatments */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xl font-semibold text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'المواعيد القادمة' : 'Upcoming Appointments'}
                    </h2>
                    <Link 
                      href={`/${locale}/dashboard/appointments`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                      {isRTL ? 'عرض الكل' : 'View All'}
                    </Link>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{appointment.type}</p>
                          <p className="text-sm text-blue-600">{appointment.date} at {appointment.time}</p>
                          <p className="text-xs text-gray-600">{appointment.focus}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{appointment.duration} min</p>
                      </div>
                    </div>
                  ))}
                  
                  <Link 
                    href={`/${locale}/dashboard/appointments/schedule`}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className={`text-sm font-medium text-gray-600 group-hover:text-blue-600 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'حجز موعد جديد' : 'Schedule New Appointment'}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Active Treatment Plans */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xl font-semibold text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'خطط العلاج النشطة' : 'Active Treatment Plans'}
                    </h2>
                    <Link 
                      href={`/${locale}/dashboard/treatments`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                      {isRTL ? 'عرض الكل' : 'View All'}
                    </Link>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {activeTreatments.map((treatment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{treatment.name}</h4>
                        <span className="text-sm text-green-600 font-medium">{treatment.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${treatment.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{treatment.duration} • Started {treatment.startDate}</span>
                        <span className="text-blue-600 font-medium">{treatment.nextMilestone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Advisor Actions & Consultation History */}
            <div className="space-y-6">
              
              {/* AI Advisor Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'مستشار الجمال الذكي' : 'AI Beauty Advisor'}
                </h3>
                <div className="space-y-3">
                  <Link 
                    href={`/${locale}/room-test`}
                    className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors group border border-blue-100"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                      <p className={`font-medium text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'استشارة فورية' : 'Instant Consultation'}
                      </p>
                      <p className={`text-xs text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'متاح الآن' : 'Available now'}
                      </p>
                    </div>
                  </Link>
                  
                  <Link 
                    href={`/${locale}/dashboard/appointments/schedule`}
                    className="flex items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                      <p className={`font-medium text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'حجز موعد' : 'Schedule Appointment'}
                      </p>
                      <p className={`text-xs text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'استشارة مفصلة' : 'Detailed consultation'}
                      </p>
                    </div>
                  </Link>

                  <Link 
                    href={`/${locale}/dashboard/treatments`}
                    className="flex items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                      <p className={`font-medium text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'عرض الخطط' : 'View Treatment Plans'}
                      </p>
                      <p className={`text-xs text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'خطط مخصصة' : 'Personalized plans'}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Consultations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'الاستشارات الأخيرة' : 'Recent Consultations'}
                  </h3>
                  <Link 
                    href={`/${locale}/dashboard/consultations`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    {isRTL ? 'عرض الكل' : 'View All'}
                  </Link>
                </div>
                <div className="space-y-3">
                  {consultationHistory.map((consultation, index) => (
                    <div key={index} className="p-3 border border-gray-100 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{consultation.type}</span>
                        <span className="text-xs text-gray-500">{consultation.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{consultation.concerns.join(', ')}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600">{consultation.recommendations} recommendations</span>
                        <span className="text-xs text-green-600">Follow-up: {consultation.followUpDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}