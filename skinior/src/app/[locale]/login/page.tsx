"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

// Google Sign-In types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: GoogleButtonOptions
          ) => void;
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleButtonOptions {
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large" | "medium" | "small";
  width?: string | number;
  text: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape: "rectangular" | "pill" | "circle" | "square";
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { login, register, googleAuthWithToken } = useAuth();
  const t = useTranslations("auth");

  const handleGoogleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        setIsLoading(true);
        setError("");

        await googleAuthWithToken(response.credential);
        router.push(`/${locale}/dashboard`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Google authentication failed"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [googleAuthWithToken, router, locale]
  );

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: handleGoogleCredentialResponse,
        });

        // Render the Google Sign-In button
        const buttonElement = document.getElementById("google-signin-button");
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: isLogin ? "signin_with" : "signup_with",
            shape: "rectangular",
          });
        }
      }
    };

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [handleGoogleCredentialResponse, isLogin]);

  // Re-render Google button when login/signup mode changes
  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      const buttonElement = document.getElementById("google-signin-button");
      if (buttonElement) {
        // Clear existing button
        buttonElement.innerHTML = "";

        // Re-render button with updated text
        window.google.accounts.id.renderButton(buttonElement, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: isLogin ? "signin_with" : "signup_with",
          shape: "rectangular",
        });
      }
    }
  }, [isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!isLogin) {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          setError(t("error.passwordsDontMatch"));
          setIsLoading(false);
          return;
        }
        if (!formData.firstName || !formData.lastName) {
          setError(t("error.fillAllFields"));
          setIsLoading(false);
          return;
        }

        // Register user
        const registerData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        };

        await register(registerData);
        router.push(`/${locale}/dashboard`);
      } else {
        // Login user
        await login(formData.email, formData.password);
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset form when switching modes
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-black rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-black rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-black/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-3 tracking-tight">
            {isLogin ? t("header.welcomeBack") : t("header.joinSkinior")}
          </h1>
          <p className="text-gray-600 text-lg">
            {isLogin
              ? t("subheader.signInToYourAccount")
              : t("subheader.createYourPersonalizedSkincareJourney")}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-white text-black shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {t("toggle.signIn")}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-white text-black shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {t("toggle.signUp")}
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("form.firstName")}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required={!isLogin}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder={t("form.placeholders.firstName")}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("form.lastName")}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required={!isLogin}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder={t("form.placeholders.lastName")}
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.emailAddress")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder={t("form.placeholders.email")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder={t("form.placeholders.password")}
            />
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("form.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required={!isLogin}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                placeholder={t("form.placeholders.confirmPassword")}
              />
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  {t("form.rememberMe")}
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-black hover:text-gray-800 font-medium"
              >
                {t("form.forgotPassword")}
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white font-medium py-4 px-6 rounded-full hover:from-gray-800 hover:to-black transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLogin ? t("button.signingIn") : t("button.creatingAccount")}
              </div>
            ) : isLogin ? (
              t("button.signIn")
            ) : (
              t("button.createAccount")
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-full p-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </form>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t("orContinueWith")}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <div
              id="google-signin-button"
              className="flex justify-center"
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            {isLogin
              ? t("footer.dontHaveAnAccount")
              : t("footer.alreadyHaveAnAccount")}{" "}
            <button
              onClick={toggleMode}
              className="text-black font-medium hover:text-gray-800 transition-colors duration-300"
            >
              {isLogin ? t("footer.signUp") : t("footer.signIn")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
