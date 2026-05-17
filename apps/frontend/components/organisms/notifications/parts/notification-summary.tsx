"use client";

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
  const readCount = Math.max(totalCount - unreadCount, 0);

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard label="Total Notifications" value={totalCount} icon={Bell} />

      <SummaryCard label="Unread" value={unreadCount} icon={BellDot} active />

      <SummaryCard label="Read" value={readCount} icon={CheckCheck} />
    </div>
  );
};
