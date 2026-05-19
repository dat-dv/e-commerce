import { OrdersView } from "@/components/organisms/orders/orders-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("OrdersPage.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function OrdersPage() {
  return <OrdersView />;
}
