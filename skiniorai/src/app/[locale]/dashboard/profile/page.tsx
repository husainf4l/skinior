"use client";

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function ProfilePage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    birthDate: '1995-06-15',
    skinType: 'Combination',
    skinConcerns: ['Acne', 'Large Pores', 'Hyperpigmentation'],
    allergies: ['Fragrances', 'Sulfates'],
    currentRoutine: 'Morning & Evening',
    goals: ['Clear Skin', 'Anti-Aging', 'Hydration']
  });

  const skinTypes = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];
  const commonConcerns = ['Acne', 'Wrinkles', 'Dark Spots', 'Large Pores', 'Dryness', 'Oiliness', 'Hyperpigmentation', 'Redness'];
  const commonAllergies = ['Fragrances', 'Sulfates', 'Parabens', 'Alcohol', 'Essential Oils', 'Retinoids'];
  const skinGoals = ['Clear Skin', 'Anti-Aging', 'Hydration', 'Brightening', 'Pore Minimizing', 'Oil Control'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item) 
        ? (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
        : [...(prev[field as keyof typeof prev] as string[]), item]
    }));
  };

  return (
    <DashboardLayout>
      <div className={`p-8 ${isRTL ? 'font-cairo text-right' : ''}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-semibold text-gray-900 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'الملف الشخصي' : 'Profile'}
              </h1>
              <p className={`text-lg text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'إدارة معلوماتك الشخصية وتفضيلات العناية ببشرتك' : 'Manage your personal information and skincare preferences'}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                isEditing 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${isRTL ? 'font-cairo' : ''}`}
            >
              {isEditing ? (isRTL ? 'حفظ' : 'Save') : (isRTL ? 'تعديل' : 'Edit')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Picture & Basic Info */}
            <div className="space-y-6">
              
              {/* Profile Picture */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-semibold text-white">SJ</span>
                  </div>
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                    {formData.name}
                  </h3>
                  <p className={`text-gray-600 mb-4 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'عضو منذ يناير 2024' : 'Member since January 2024'}
                  </p>
                  <button className={`text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'تغيير الصورة' : 'Change Photo'}
                  </button>
                </div>
              </div>

              {/* Skin Profile Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'ملخص البشرة' : 'Skin Profile Summary'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'نوع البشرة' : 'Skin Type'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{formData.skinType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'المشاكل الرئيسية' : 'Main Concerns'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{formData.skinConcerns.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'الحساسيات' : 'Allergies'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{formData.allergies.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className={`text-lg font-semibold text-gray-900 mb-6 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      } ${isRTL ? 'font-cairo text-right' : ''}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      } ${isRTL ? 'font-cairo text-right' : ''}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      } ${isRTL ? 'font-cairo text-right' : ''}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                      {isRTL ? 'تاريخ الميلاد' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      disabled={!isEditing}
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      } ${isRTL ? 'font-cairo text-right' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Skin Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className={`text-lg font-semibold text-gray-900 mb-6 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'معلومات البشرة' : 'Skin Information'}
                </h3>
                
                {/* Skin Type */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'نوع البشرة' : 'Skin Type'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {skinTypes.map((type) => (
                      <button
                        key={type}
                        disabled={!isEditing}
                        onClick={() => handleInputChange('skinType', type)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          formData.skinType === type
                            ? 'bg-blue-600 text-white'
                            : isEditing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-500'
                        } ${isRTL ? 'font-cairo' : ''}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Concerns */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'مشاكل البشرة' : 'Skin Concerns'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {commonConcerns.map((concern) => (
                      <button
                        key={concern}
                        disabled={!isEditing}
                        onClick={() => handleArrayToggle('skinConcerns', concern)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          formData.skinConcerns.includes(concern)
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : isEditing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-500'
                        } ${isRTL ? 'font-cairo' : ''}`}
                      >
                        {concern}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'الحساسيات' : 'Allergies & Sensitivities'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {commonAllergies.map((allergy) => (
                      <button
                        key={allergy}
                        disabled={!isEditing}
                        onClick={() => handleArrayToggle('allergies', allergy)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          formData.allergies.includes(allergy)
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : isEditing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-500'
                        } ${isRTL ? 'font-cairo' : ''}`}
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'أهداف العناية بالبشرة' : 'Skincare Goals'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {skinGoals.map((goal) => (
                      <button
                        key={goal}
                        disabled={!isEditing}
                        onClick={() => handleArrayToggle('goals', goal)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          formData.goals.includes(goal)
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : isEditing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-500'
                        } ${isRTL ? 'font-cairo' : ''}`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className={`text-lg font-semibold text-gray-900 mb-6 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'إعدادات الحساب' : 'Account Settings'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className={`font-medium text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'الإشعارات' : 'Notifications'}
                      </h4>
                      <p className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'تلقي تحديثات حول المنتجات والعروض' : 'Receive updates about products and offers'}
                      </p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className={`font-medium text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'تذكيرات الروتين' : 'Routine Reminders'}
                      </h4>
                      <p className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                        {isRTL ? 'تذكيرات للعناية اليومية بالبشرة' : 'Daily skincare routine reminders'}
                      </p>
                    </div>
                    <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}