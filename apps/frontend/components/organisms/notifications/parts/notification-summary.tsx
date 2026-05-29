"use client";

import { TYPOGRAPHY } from "@/constants/typography";
import { Bell, BellDot, CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { SummaryCard } from "@ecommerce/ui";

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

  const summaryItems = [
    {
      label: t("summary.total"),
      value: totalCount,
      icon: Bell,
    },
    {
      label: t("summary.unread"),
      value: unreadCount,
      icon: BellDot,
      active: true,
    },
    {
      label: t("summary.read"),
      value: readCount,
      icon: CheckCheck,
    },
  ];

  return (
    <section
      aria-label={t("summary.label")}
      className="-mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:mb-8 sm:px-0"
    >
      <div className="flex min-w-max gap-3 sm:min-w-0 sm:gap-4">
        {summaryItems.map(({ label, value, icon, active }) => (
          <SummaryCard
            key={label}
            label={label}
            value={value}
            icon={icon}
            active={active}
            className="min-w-[148px] flex-1 shrink-0 rounded-2xl px-3 py-2.5 sm:min-w-[180px] sm:px-4 sm:py-3"
            contentClassName="gap-5"
            labelClassName={`
              whitespace-nowrap
              ${TYPOGRAPHY.badge}
              tracking-[0.12em]
            `}
            valueClassName="
              mt-1.5
              text-2xl
              sm:text-3xl
            "
            iconWrapperClassName="
              size-8
              rounded-xl
              sm:size-9
            "
            iconClassName="size-4"
          />
        ))}
      </div>
    </section>
  );
};
