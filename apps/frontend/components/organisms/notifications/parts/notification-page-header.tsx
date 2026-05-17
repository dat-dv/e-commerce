"use client";

import { Bell, BellDot, CheckCheck, Megaphone } from "lucide-react";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";

const NOTIFICATION_HEADER_ICONS = [Bell, BellDot, CheckCheck, Megaphone];

interface NotificationPageHeaderProps {
  unreadCount: number;
}

export const NotificationPageHeader = ({
  unreadCount,
}: NotificationPageHeaderProps) => {
  const description =
    unreadCount > 0
      ? `You have ${unreadCount} unread update${unreadCount > 1 ? "s" : ""}. Review order activity, account alerts, and promotions in one place.`
      : "You are all caught up. Order activity, account alerts, and promotions will appear here.";

  return (
    <AnimatedPageHeader
      title="Notification"
      highlight="Center"
      description={description}
      icons={NOTIFICATION_HEADER_ICONS}
    />
  );
};
