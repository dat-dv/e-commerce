import { OrdersView } from "@/components/organisms/orders/orders-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History | Luxury E-commerce",
  description: "Manage your purchase history and track your order status.",
};

export default function OrdersPage() {
  return <OrdersView />;
}
