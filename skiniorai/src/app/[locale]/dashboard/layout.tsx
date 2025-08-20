import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import "../../globals.css";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "../../../contexts/AuthContext";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  const locales = ["en", "ar"];
  if (!locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  );
}
