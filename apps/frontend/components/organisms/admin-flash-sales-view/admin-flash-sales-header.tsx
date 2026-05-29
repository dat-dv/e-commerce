"use client";

import { AnimatedPageHeader, Button } from "@ecommerce/ui";
import { BadgePercent, CalendarClock, Clock3, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export function AdminFlashSalesHeader({
  loading,
  onRefresh,
}: {
  loading: boolean;
  onRefresh: () => void;
}) {
  const t = useTranslations("AdminFlashSalesPage.header");

  return (
    <AnimatedPageHeader
      title={t("title")}
      highlight={t("adminCenter")}
      description={t("description")}
      icons={[BadgePercent, CalendarClock, Clock3, RefreshCw]}
      rightContent={
        <Button
          type="button"
          variant="ghost"
          disabled={loading}
          onClick={onRefresh}
          className="border-content/10 bg-surface/50 text-content hover:bg-content/5 focus-visible:ring-primary/40 inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold opacity-100 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
        >
          <RefreshCw
            aria-hidden="true"
            className={loading ? "size-4 animate-spin" : "size-4 opacity-75"}
          />
          {t("refresh")}
        </Button>
      }
    />
  );
}
