import { type Metadata } from "next";

import { OrderDetailView } from "@/components/organisms/order-detail-view";

export const metadata: Metadata = {
  title: "Order Detail",
};

export default function OrderDetailPage() {
  return <OrderDetailView />;
}
