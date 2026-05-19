import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CategoriesView } from "@/components/organisms/categories-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CategoriesPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CategoriesPage() {
  return <CategoriesView />;
}
