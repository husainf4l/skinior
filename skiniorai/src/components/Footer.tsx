"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image
                src={
                  locale === "ar"
                    ? "/logos/skinior-logo-black-ar.png"
                    : "/logos/skinior-logo-black.png"
                }
                alt="Skinior"
                width={120}
                height={37}
                className="h-9 w-auto"
              />
            </div>
            <p className="text-gray-600 mb-4 max-w-md leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Quick Links
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  {t("navigation.home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  {t("navigation.about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/skin-analysis`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  {t("navigation.skinAnalysis")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  {t("navigation.products")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/shop`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  {t("navigation.shop")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  {locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Legal</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="text-center text-gray-500 font-medium">
            {t("footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
