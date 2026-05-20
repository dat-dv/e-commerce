import HelpFAQView from "@/components/organisms/help-faq-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "HelpCenter.faqMetadata",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function FAQPage() {
  return <HelpFAQView />;
}
