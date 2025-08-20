import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import CheckoutSuccessPage from "@/components/checkout/CheckoutSuccessPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CheckoutSuccessPage />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t("checkout.successTitle")} - Skinior`,
    description: t("checkout.successDescription"),
  };
}
