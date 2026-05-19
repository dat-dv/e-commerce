import { SettingsView } from "@/components/organisms/settings-view";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SettingsPage() {
  return <SettingsView />;
}
