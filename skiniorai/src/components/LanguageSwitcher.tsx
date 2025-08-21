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

  const getOtherLanguage = () => {
    return currentLocale === "en" ? "ar" : "en";
  };

  const getDisplayText = () => {
    return currentLocale === "en" ? "عربي" : "EN";
  };

  return (
    <button
      onClick={() => switchLanguage(getOtherLanguage())}
      disabled={isPending}
      className={`text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors duration-200 ${
        isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      aria-label={`Switch to ${currentLocale === "en" ? "Arabic" : "English"}`}
    >
      {isPending ? "..." : getDisplayText()}
    </button>
  );
}
