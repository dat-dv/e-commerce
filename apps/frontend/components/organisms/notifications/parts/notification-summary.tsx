"use client";

import { TYPOGRAPHY } from "@/constants/typography";
import { Bell, BellDot, CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import SummaryCard from "@/components/molecules/summary-card";

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
      <div className="flex gap-3 sm:grid sm:grid-cols-3 sm:gap-4">
        {summaryItems.map(({ label, value, icon, active }) => (
          <SummaryCard
            key={label}
            label={label}
            value={value}
            icon={icon}
            active={active}
            className="
              min-h-[88px]
              min-w-[140px]
              flex-1
              rounded-2xl
              p-3

              sm:min-h-[120px]
              sm:min-w-0
              sm:rounded-3xl
              sm:p-5
            "
            contentClassName="gap-4"
            labelClassName={`
              truncate
              ${TYPOGRAPHY.badge}
              tracking-[0.12em]

              sm:${TYPOGRAPHY.caption}
              sm:tracking-[0.18em]
            `}
            valueClassName="
              mt-2
              text-2xl

              sm:mt-3
              sm:text-4xl
            "
            iconWrapperClassName="
              size-8
              rounded-xl

              sm:size-11
              sm:rounded-2xl
            "
            iconClassName="size-4 sm:size-5"
          />
        ))}
      </div>
    </section>
  );
};
