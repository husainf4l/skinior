"use client";

import { usePathname, useRouter } from "../i18n/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as string;
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (locale: string) => {
    if (locale === currentLocale) return;

    startTransition(() => {
      router.push(pathname, { locale });
    });
  };

  const languages = [
    { code: "en", name: "English", shortName: "EN" },
    { code: "ar", name: "العربية", shortName: "عربي" },
  ];

  return (
    <div className="relative">
      <div className="flex items-center bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg overflow-hidden shadow-sm">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            disabled={isPending}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
              currentLocale === lang.code
                ? "bg-gray-900 text-white shadow-md"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            } ${
              isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } ${lang.code === "ar" ? "font-semibold" : ""}`}
            aria-label={`Switch to ${lang.name}`}
            title={`Switch to ${lang.name}`}
          >
            <span className="relative z-10">{lang.shortName}</span>
            {currentLocale === lang.code && (
              <div className="absolute inset-0 bg-gray-900 rounded-md transition-all duration-200" />
            )}
          </button>
        ))}
      </div>

      {isPending && (
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-900 rounded-full" />
        </div>
      )}
    </div>
  );
}
