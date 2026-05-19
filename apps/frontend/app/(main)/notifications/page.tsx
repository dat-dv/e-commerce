import { NotificationsView } from "@/components/organisms/notifications";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("NotificationsPage.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function NotificationsPage() {
  return <NotificationsView />;
}
