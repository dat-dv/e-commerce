import { HelpContactView } from "@/components/organisms/help-contact-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "HelpCenter.contactMetadata",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage() {
  return <HelpContactView />;
}
