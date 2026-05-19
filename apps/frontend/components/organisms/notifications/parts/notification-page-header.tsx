"use client";

import { Bell, BellDot, CheckCheck, Megaphone } from "lucide-react";

import { useTranslations } from "next-intl";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";

const NOTIFICATION_HEADER_ICONS = [Bell, BellDot, CheckCheck, Megaphone];

interface NotificationPageHeaderProps {
  unreadCount: number;
}

export const NotificationPageHeader = ({
  unreadCount,
}: NotificationPageHeaderProps) => {
  const t = useTranslations("NotificationsPage");

  const description =
    unreadCount > 0
      ? t("banner.unreadDescription", { count: unreadCount })
      : t("banner.allCaughtUpDescription");

  return (
    <AnimatedPageHeader
      title={t("banner.title")}
      highlight={t("banner.highlight")}
      description={description}
      icons={NOTIFICATION_HEADER_ICONS}
    />
  );
};
