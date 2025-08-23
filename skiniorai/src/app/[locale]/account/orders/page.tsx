import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import AccountOrdersPage from "@/components/account/AccountOrdersPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccountOrdersPage />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t("account.orders.title")} - Skinior`,
    description: t("account.orders.description"),
  };
}
