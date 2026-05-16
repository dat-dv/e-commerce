import { Metadata } from "next";
import { NotificationsView } from "@/components/organisms/notifications/notifications-view";

export const metadata: Metadata = {
  title: "Notifications | Antigravity E-commerce",
  description: "View and manage your account notifications and activity.",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
