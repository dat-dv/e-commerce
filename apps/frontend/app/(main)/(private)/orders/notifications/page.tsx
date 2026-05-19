import { Metadata } from "next";
import { NotificationsView } from "@/components/organisms/notifications";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("OrdersPage.notificationsMetadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function NotificationsPage() {
  return <NotificationsView />;
}
