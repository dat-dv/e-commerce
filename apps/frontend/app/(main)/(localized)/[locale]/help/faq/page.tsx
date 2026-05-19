import type { Metadata } from "next";
import HelpFAQView from "@/components/organisms/help-faq-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("HelpCenter.faqMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function FAQPage() {
  return <HelpFAQView />;
}
