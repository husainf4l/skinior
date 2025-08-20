import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import CheckoutPage from "@/components/checkout/CheckoutPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CheckoutPage />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t("checkout.title")} - Skinior`,
    description: t("checkout.description"),
  };
}
