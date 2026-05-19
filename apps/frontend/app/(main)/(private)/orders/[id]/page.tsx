import { OrderDetailView } from "@/components/organisms/orders/order-detail-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("OrdersPage.detailMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <OrderDetailView orderId={params.id} />;
}
