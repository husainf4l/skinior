"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCart, useCartStore } from "@/lib/store/cart-store";
import Image from "next/image";
import Link from "next/link";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormErrors {
  [key: string]: string;
}

const CheckoutPage: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const cart = useCart();
  const { clearCart } = useCartStore();
  const isRTL = locale === "ar";

  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Jordan",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form data
  const validateForm = useCallback((data: FormData): FormErrors => {
    const errors: FormErrors = {};

    // Email validation
    if (!data.email) {
      errors.email = t("checkout.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = t("checkout.errors.emailInvalid");
    }

    // Name validation
    if (!data.firstName.trim()) {
      errors.firstName = t("checkout.errors.firstNameRequired");
    } else if (data.firstName.trim().length < 2) {
      errors.firstName = t("checkout.errors.firstNameMinLength");
    }

    if (!data.lastName.trim()) {
      errors.lastName = t("checkout.errors.lastNameRequired");
    } else if (data.lastName.trim().length < 2) {
      errors.lastName = t("checkout.errors.lastNameMinLength");
    }

    // Phone validation
    if (!data.phone) {
      errors.phone = t("checkout.errors.phoneRequired");
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = t("checkout.errors.phoneInvalid");
    }

    // Address validation
    if (!data.address.trim()) {
      errors.address = t("checkout.errors.addressRequired");
    } else if (data.address.trim().length < 10) {
      errors.address = t("checkout.errors.addressMinLength");
    }

    if (!data.city.trim()) {
      errors.city = t("checkout.errors.cityRequired");
    }

    if (!data.country) {
      errors.country = t("checkout.errors.countryRequired");
    }

    return errors;
  }, [t]);

  const formatPrice = (price: number) => {
    return isRTL ? `${price.toFixed(2)} د.أ` : `JOD ${price.toFixed(2)}`;
  };

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [formErrors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || isProcessing) {
      return;
    }

    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setIsProcessing(true);

    try {
      // Simulate checkout process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart after successful checkout
      await clearCart();

      // Redirect to success page
      if (typeof window !== "undefined") {
        window.location.href = `/${locale}/checkout/success`;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setFormErrors({
        general: t("checkout.errors.checkoutFailed"),
      });
    } finally {
      setIsSubmitting(false);
      setIsProcessing(false);
    }
  }, [formData, validateForm, clearCart, locale, isSubmitting, isProcessing, t]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      setFormErrors({});
    };
  }, []);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                />
              </svg>
            </div>
            <h1
              className={`text-xl font-semibold text-gray-900 mb-2 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {t("cart.empty")}
            </h1>
            <p className={`text-gray-600 mb-6 ${isRTL ? "font-cairo" : ""}`}>
              {t("checkout.emptyDescription")}
            </p>
            <Link href={`/${locale}/shop`}>
              <button
                className={`bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {t("cart.continueShopping")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold text-gray-900 ${
              isRTL ? "font-cairo text-right" : ""
            }`}
          >
            {t("checkout.title")}
          </h1>
          <p
            className={`text-gray-600 mt-2 ${
              isRTL ? "font-cairo text-right" : ""
            }`}
          >
            {t("checkout.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2
                className={`text-xl font-semibold text-gray-900 mb-6 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {t("checkout.contactInfo")}
              </h2>

              {/* General Error Display */}
              {formErrors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className={isRTL ? "font-cairo" : ""}>
                      {formErrors.general}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium text-gray-700 mb-2 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {t("checkout.email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        formErrors.email
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-black/20 focus:border-black"
                      }`}
                      placeholder={t("checkout.emailPlaceholder")}
                      disabled={isSubmitting}
                    />
                    {formErrors.email && (
                      <p className={`mt-1 text-sm text-red-600 ${isRTL ? "font-cairo text-right" : ""}`}>
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-gray-700 mb-2 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {t("checkout.phone")} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        formErrors.phone
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-black/20 focus:border-black"
                      }`}
                      placeholder={t("checkout.phonePlaceholder")}
                      disabled={isSubmitting}
                    />
                    {formErrors.phone && (
                      <p className={`mt-1 text-sm text-red-600 ${isRTL ? "font-cairo text-right" : ""}`}>
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium text-gray-700 mb-2 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {t("checkout.firstName")} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        formErrors.firstName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-black/20 focus:border-black"
                      }`}
                      placeholder={t("checkout.firstNamePlaceholder")}
                      disabled={isSubmitting}
                    />
                    {formErrors.firstName && (
                      <p className={`mt-1 text-sm text-red-600 ${isRTL ? "font-cairo text-right" : ""}`}>
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-gray-700 mb-2 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {t("checkout.lastName")} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        formErrors.lastName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-black/20 focus:border-black"
                      }`}
                      placeholder={t("checkout.lastNamePlaceholder")}
                      disabled={isSubmitting}
                    />
                    {formErrors.lastName && (
                      <p className={`mt-1 text-sm text-red-600 ${isRTL ? "font-cairo text-right" : ""}`}>
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="pt-6 border-t border-gray-200">
                  <h3
                    className={`text-lg font-semibold text-gray-900 mb-4 ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {t("checkout.shippingAddress")}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        className={`block text-sm font-medium text-gray-700 mb-2 ${
                          isRTL ? "font-cairo text-right" : ""
                        }`}
                      >
                        {t("checkout.address")} *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          formErrors.address
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-black/20 focus:border-black"
                        }`}
                        placeholder={t("checkout.addressPlaceholder")}
                        disabled={isSubmitting}
                      />
                      {formErrors.address && (
                        <p className={`mt-1 text-sm text-red-600 ${isRTL ? "font-cairo text-right" : ""}`}>
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium text-gray-700 mb-2 ${
                            isRTL ? "font-cairo text-right" : ""
                          }`}
                        >
                          {t("checkout.city")} *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            formErrors.city
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-black/20 focus:border-black"
                          }`}
                          placeholder={t("checkout.cityPlaceholder")}
                          disabled={isSubmitting}
                        />
                        {formErrors.city && (
                          <p className={`mt-1 text-sm text-red-600 ${isRTL ? "font-cairo text-right" : ""}`}>
                            {formErrors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium text-gray-700 mb-2 ${
                            isRTL ? "font-cairo text-right" : ""
                          }`}
                        >
                          {t("checkout.postalCode")}
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                          placeholder={t("checkout.postalCodePlaceholder")}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium text-gray-700 mb-2 ${
                            isRTL ? "font-cairo text-right" : ""
                          }`}
                        >
                          {t("checkout.country")} *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            formErrors.country
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-black/20 focus:border-black"
                          }`}
                          disabled={isSubmitting}
                        >
                          <option value="Jordan">Jordan</option>
                          <option value="UAE">UAE</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="Lebanon">Lebanon</option>
                        </select>
                        {formErrors.country && (
                          <p className={`mt-1 text-sm text-red-600 ${isRTL ? "font-cairo text-right" : ""}`}>
                            {formErrors.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || isProcessing}
                    className={`w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {isSubmitting || isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {isProcessing ? t("checkout.processing") : t("checkout.submitting")}
                      </div>
                    ) : (
                      t("checkout.placeOrder")
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2
                className={`text-xl font-semibold text-gray-900 mb-6 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {t("checkout.orderSummary")}
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={isRTL ? item.titleAr || item.title : item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium text-gray-900 text-sm ${
                          isRTL ? "font-cairo text-right" : ""
                        }`}
                      >
                        {isRTL ? item.titleAr || item.title : item.title}
                      </h4>
                      <div
                        className={`flex justify-between items-center mt-1 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span
                          className={`text-sm text-gray-500 ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {t("checkout.qty")}: {item.quantity}
                        </span>
                        <span
                          className={`font-semibold text-gray-900 text-sm ${
                            isRTL ? "font-cairo" : ""
                          }`}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div
                  className={`flex justify-between text-sm ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span
                    className={`text-gray-600 ${isRTL ? "font-cairo" : ""}`}
                  >
                    {t("cart.subtotal")}
                  </span>
                  <span className={`font-medium ${isRTL ? "font-cairo" : ""}`}>
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                <div
                  className={`flex justify-between text-sm ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span
                    className={`text-gray-600 ${isRTL ? "font-cairo" : ""}`}
                  >
                    {t("cart.shipping")}
                  </span>
                  <span className={`font-medium ${isRTL ? "font-cairo" : ""}`}>
                    {cart.shipping > 0
                      ? formatPrice(cart.shipping)
                      : t("checkout.freeShipping")}
                  </span>
                </div>

                {cart.tax > 0 && (
                  <div
                    className={`flex justify-between text-sm ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span
                      className={`text-gray-600 ${isRTL ? "font-cairo" : ""}`}
                    >
                      {t("cart.tax")}
                    </span>
                    <span
                      className={`font-medium ${isRTL ? "font-cairo" : ""}`}
                    >
                      {formatPrice(cart.tax)}
                    </span>
                  </div>
                )}

                <hr className="my-3" />

                <div
                  className={`flex justify-between text-lg font-semibold ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span
                    className={`text-gray-900 ${isRTL ? "font-cairo" : ""}`}
                  >
                    {t("cart.total")}
                  </span>
                  <span
                    className={`text-gray-900 ${isRTL ? "font-cairo" : ""}`}
                  >
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className={isRTL ? "font-cairo" : ""}>
                    {t("checkout.secureCheckout")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
