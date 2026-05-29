"use client";

import { CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@ecommerce/ui";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export const NotificationHeader = ({
  unreadCount,
  onMarkAllAsRead,
}: NotificationHeaderProps) => {
  const t = useTranslations("NotificationsPage");

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="space-y-2">
        <h1 className="text-content text-3xl font-bold tracking-tight md:text-4xl">
          {t("header.title")}
        </h1>
        <p className="text-content/40 font-inter text-sm font-medium">
          {t("header.subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {unreadCount > 0 && (
          <Button
            onPress={onMarkAllAsRead}
            className="group bg-primary hover:bg-primary/90 shadow-primary/20 flex h-auto items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-white opacity-100 shadow-xl transition-all hover:opacity-100 active:scale-95"
          >
            <CheckCheck size={14} />
            {t("header.markAllAsRead")}
          </Button>
        )}
      </div>
    </div>
  );
};
