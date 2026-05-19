"use client";

import { useTranslations } from "next-intl";

import SummaryCard from "@/components/molecules/summary-card";
import { Bell, BellDot, CheckCheck } from "lucide-react";

interface NotificationSummaryProps {
  totalCount: number;
  unreadCount: number;
}

export const NotificationSummary = ({
  totalCount,
  unreadCount,
}: NotificationSummaryProps) => {
  const t = useTranslations("NotificationsPage");
  const readCount = Math.max(totalCount - unreadCount, 0);

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard label={t("summary.total")} value={totalCount} icon={Bell} />

      <SummaryCard
        label={t("summary.unread")}
        value={unreadCount}
        icon={BellDot}
        active
      />

      <SummaryCard
        label={t("summary.read")}
        value={readCount}
        icon={CheckCheck}
      />
    </div>
  );
};
