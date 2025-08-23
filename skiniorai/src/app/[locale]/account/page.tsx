import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import AccountPage from "@/components/account/AccountPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccountPage />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t("account.title")} - Skinior`,
    description: t("account.description"),
  };
}
