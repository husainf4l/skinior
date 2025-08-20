"use client";

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function OrdersPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [selectedFilter, setSelectedFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-20',
      status: 'Delivered',
      total: 89.99,
      items: [
        { 
          name: 'Gentle Foaming Cleanser', 
          brand: 'SkinioR Essentials', 
          price: 29.99, 
          quantity: 1,
          image: '/placeholder-product.jpg'
        },
        { 
          name: 'Vitamin C Brightening Serum', 
          brand: 'SkinioR Advanced', 
          price: 59.99, 
          quantity: 1,
          image: '/placeholder-product.jpg'
        }
      ],
      tracking: 'DELIVERED',
      deliveryDate: '2024-01-22'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-18',
      status: 'Processing',
      total: 45.99,
      items: [
        { 
          name: 'Hydrating Moisturizer SPF 30', 
          brand: 'SkinioR Daily', 
          price: 45.99, 
          quantity: 1,
          image: '/placeholder-product.jpg'
        }
      ],
      tracking: 'IN_TRANSIT',
      estimatedDelivery: '2024-01-25'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-10',
      status: 'Delivered',
      total: 124.97,
      items: [
        { 
          name: 'Retinol Night Treatment', 
          brand: 'SkinioR Professional', 
          price: 79.99, 
          quantity: 1,
          image: '/placeholder-product.jpg'
        },
        { 
          name: 'Niacinamide Serum', 
          brand: 'SkinioR Essentials', 
          price: 34.99, 
          quantity: 1,
          image: '/placeholder-product.jpg'
        },
        { 
          name: 'Gentle Eye Cream', 
          brand: 'SkinioR Daily', 
          price: 24.99, 
          quantity: 1,
          image: '/placeholder-product.jpg'
        }
      ],
      tracking: 'DELIVERED',
      deliveryDate: '2024-01-14'
    },
    {
      id: 'ORD-2024-004',
      date: '2024-01-05',
      status: 'Cancelled',
      total: 67.98,
      items: [
        { 
          name: 'Exfoliating Toner', 
          brand: 'SkinioR Advanced', 
          price: 39.99, 
          quantity: 1,
          image: '/placeholder-product.jpg'
        },
        { 
          name: 'Hydrating Face Mask', 
          brand: 'SkinioR Weekly', 
          price: 27.99, 
          quantity: 1,
          image: '/placeholder-product.jpg'
        }
      ],
      tracking: 'CANCELLED',
      cancelReason: 'Requested by customer'
    }
  ];

  const filters = [
    { key: 'all', label: isRTL ? 'جميع الطلبات' : 'All Orders', count: orders.length },
    { key: 'delivered', label: isRTL ? 'مُسلمة' : 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
    { key: 'processing', label: isRTL ? 'قيد المعالجة' : 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { key: 'cancelled', label: isRTL ? 'ملغاة' : 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className={`p-8 ${isRTL ? 'font-cairo text-right' : ''}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className={`text-4xl font-semibold text-gray-900 mb-3 ${isRTL ? 'font-cairo' : ''}`}>
              {isRTL ? 'طلباتي' : 'My Orders'}
            </h1>
            <p className={`text-lg text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
              {isRTL ? 'تتبع طلباتك وتاريخ المشتريات' : 'Track your orders and purchase history'}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                    selectedFilter === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${isRTL ? 'font-cairo space-x-reverse' : ''}`}
                >
                  <span>{filter.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedFilter === filter.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-medium text-gray-900 mb-2 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'لا توجد طلبات' : 'No Orders Found'}
                </h3>
                <p className={`text-gray-500 ${isRTL ? 'font-cairo' : ''}`}>
                  {isRTL ? 'لم نجد أي طلبات تطابق الفلتر المحدد' : 'No orders match the selected filter'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                            {order.id}
                          </h3>
                          <p className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                            {isRTL ? 'تاريخ الطلب: ' : 'Ordered on '}{formatDate(order.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} ${isRTL ? 'font-cairo' : ''}`}>
                          {isRTL ? (
                            order.status === 'Delivered' ? 'مُسلم' :
                            order.status === 'Processing' ? 'قيد المعالجة' :
                            order.status === 'Cancelled' ? 'ملغي' : order.status
                          ) : order.status}
                        </span>
                        <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                          <p className="text-lg font-semibold text-gray-900">
                            ${order.total.toFixed(2)}
                          </p>
                          <p className={`text-xs text-gray-500 ${isRTL ? 'font-cairo' : ''}`}>
                            {order.items.length} {isRTL ? 'منتج' : 'items'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium text-gray-900 ${isRTL ? 'font-cairo' : ''}`}>
                              {item.name}
                            </h4>
                            <p className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                              {item.brand}
                            </p>
                            <p className={`text-xs text-gray-500 ${isRTL ? 'font-cairo' : ''}`}>
                              {isRTL ? 'الكمية: ' : 'Qty: '}{item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {order.status === 'Delivered' && order.deliveryDate && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className={isRTL ? 'font-cairo' : ''}>
                              {isRTL ? 'تم التسليم في ' : 'Delivered on '}{formatDate(order.deliveryDate)}
                            </span>
                          </div>
                        )}
                        {order.status === 'Processing' && order.estimatedDelivery && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className={isRTL ? 'font-cairo' : ''}>
                              {isRTL ? 'التسليم المتوقع: ' : 'Expected delivery: '}{formatDate(order.estimatedDelivery)}
                            </span>
                          </div>
                        )}
                        {order.status === 'Cancelled' && order.cancelReason && (
                          <div className="flex items-center text-sm text-red-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className={isRTL ? 'font-cairo' : ''}>
                              {order.cancelReason}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        {order.status === 'Processing' && (
                          <button className={`text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors ${isRTL ? 'font-cairo' : ''}`}>
                            {isRTL ? 'تتبع الطلب' : 'Track Order'}
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <button className={`text-green-600 text-sm font-medium hover:text-green-700 transition-colors ${isRTL ? 'font-cairo' : ''}`}>
                            {isRTL ? 'إعادة الطلب' : 'Reorder'}
                          </button>
                        )}
                        <button className={`text-gray-600 text-sm font-medium hover:text-gray-700 transition-colors ${isRTL ? 'font-cairo' : ''}`}>
                          {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary Stats */}
          {filteredOrders.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'font-cairo' : ''}`}>
                {isRTL ? 'ملخص الطلبات' : 'Order Summary'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-semibold text-gray-900">
                    ${filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </p>
                  <p className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'إجمالي المبلغ' : 'Total Spent'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-gray-900">
                    {filteredOrders.reduce((sum, order) => sum + order.items.length, 0)}
                  </p>
                  <p className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'إجمالي المنتجات' : 'Total Items'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-gray-900">
                    {filteredOrders.filter(o => o.status === 'Delivered').length}
                  </p>
                  <p className={`text-sm text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                    {isRTL ? 'طلبات مُسلمة' : 'Delivered Orders'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}