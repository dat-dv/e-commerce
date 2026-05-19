import type { Metadata } from "next";
import HelpView from "@/components/organisms/help-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("HelpCenter.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function HelpPage() {
  return <HelpView />;
}
