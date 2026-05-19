import { Metadata } from "next";
import { NotificationsView } from "@/components/organisms/notifications";

export const metadata: Metadata = {
  title: "Order Notifications | E-commerce",
  description: "View and manage your order notifications and account activity.",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
