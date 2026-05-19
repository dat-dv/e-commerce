import { AdminOrdersView } from "@/components/organisms/admin-orders-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("AdminOrdersPage.header");
  return {
    title: `${t("title")} | Luxury E-commerce`,
    description: t("description"),
  };
}

export default function AdminOrdersPage() {
  return <AdminOrdersView />;
}
