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
    <div className="bg-surface/80 backdrop-blur-2xl border-b border-content/[0.05]">
      <div className="container mx-auto px-4 py-6 max-w-4xl flex items-center gap-6">
        <Link
          href={APP_ROUTES.ORDERS}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-content/[0.05] transition-colors border border-content/[0.05]"
        >
          <ArrowLeft className="w-5 h-5 text-content/60" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-content tracking-tight">
            {t("card.orderNumber", { id: orderId.slice(-8).toUpperCase() })}
          </h1>
          <p className="text-xs text-content/40 mt-1 font-medium">
            {new Date(createdAt).toLocaleDateString(locale, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="ml-auto">
          <span
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-full",
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
