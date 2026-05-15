import { OrderDetailView } from "@/components/organisms/orders/order-detail-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details | Luxury E-commerce",
  description: "View details of your premium order.",
};

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <OrderDetailView orderId={params.id} />;
}
