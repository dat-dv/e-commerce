import type { Metadata } from "next";
import PrivacyView from "@/components/organisms/privacy-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function PrivacyPage() {
  return <PrivacyView />;
}
