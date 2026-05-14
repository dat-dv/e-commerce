import { OrdersView } from "@/components/organisms/orders/orders-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn mua | E-commerce Premium",
  description: "Quản lý lịch sử mua hàng và trạng thái đơn hàng của bạn.",
};

export default function OrdersPage() {
  return <OrdersView />;
}
