import type { Metadata } from "next";
import HelpFAQView from "@/components/organisms/help-faq-view";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "HelpCenter.faqMetadata",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HelpFAQView />;
}
