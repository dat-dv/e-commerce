"use client";

import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function OrderDetailHeader({
  orderId,
  createdAt,
  locale,
  statusLabel,
  statusColor,
}: {
  orderId: string;
  createdAt: string;
  locale: string;
  statusLabel: string;
  statusColor: string;
}) {
  const t = useTranslations("OrdersPage");

  return (
    <div className="bg-surface/80 border-content/[0.05] border-b backdrop-blur-2xl">
      <div className="container mx-auto flex max-w-4xl items-start gap-3 px-4 py-5 sm:items-center sm:gap-6 sm:py-6">
        <Link
          href={APP_ROUTES.ORDERS}
          className="border-content/[0.05] hover:bg-content/[0.05] flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors"
          aria-label="Back to orders"
        >
          <ArrowLeft className="text-content/60 h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-content truncate text-lg font-bold tracking-tight sm:text-xl">
            {t("card.orderNumber", { id: orderId.slice(-8).toUpperCase() })}
          </h1>
          <p className="text-content/40 mt-1 text-xs font-medium">
            {new Date(createdAt).toLocaleDateString(locale, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="shrink-0">
          <span
            className={cn(
              "inline-flex max-w-32 truncate rounded-full px-3 py-1.5 text-xs font-bold sm:max-w-none sm:px-4",
              statusColor,
            )}
          >
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
