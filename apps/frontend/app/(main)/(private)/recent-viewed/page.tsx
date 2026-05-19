import { getTranslations } from "next-intl/server";
import { RecentViewedView } from "@/components/organisms/recent-viewed/recent-viewed-view";

export async function generateMetadata() {
  const t = await getTranslations("RecentViewedPage.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RecentViewedPage() {
  return <RecentViewedView />;
}
