"use client";

import Button from "@/components/atoms/button";
import { AppStatusDropdown } from "@/components/molecules/app-status-dropdown";
import { OrderItemsPanel } from "@/components/molecules/order-part/order-items-panel";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import { AdminOrderRowProps } from "./admin-orders.types";
import { getOrderPreview } from "./admin-orders.utils";
import { OrderIdCell } from "./order-id-cell";
import { OrderPreview } from "./order-preview";

export function OrderCompactCard({
  order,
  updatingId,
  isExpanded,
  onCopy,
  onExpandedToggle,
  onStatusUpdate,
}: AdminOrderRowProps) {
  const t = useTranslations("AdminOrdersPage.results");
  const locale = useLocale();

  const preview = getOrderPreview(order, t("productFallback"));
  const isUpdating = updatingId === order.id;

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  return (
    <article
      className={cn(
        UI_RADIUS.panel,
        "border-content/[0.06] bg-surface/40 border p-5 shadow-sm backdrop-blur-md transition-all duration-200 hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-content/45 text-xs font-semibold uppercase">
            {t("orderId")}
          </p>
          <OrderIdCell orderId={order.id} onCopy={onCopy} />
        </div>
        <AppStatusDropdown
          orderId={order.id}
          status={order.status}
          disabled={isUpdating}
          onStatusUpdate={onStatusUpdate}
        />
      </div>

      <div className="mt-4">
        <OrderPreview preview={preview} />
      </div>

      <Button
        type="button"
        variant="ghost"
        aria-expanded={isExpanded}
        onClick={() => onExpandedToggle(order.id)}
        className={cn(
          UI_RADIUS.control,
          "border-content/15 text-content hover:bg-content/5 focus-visible:ring-primary/40 mt-4 inline-flex h-10 w-full items-center justify-center gap-2 border text-sm font-semibold opacity-100 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:scale-95",
        )}
      >
        <ChevronDown
          aria-hidden="true"
          className={
            isExpanded
              ? "size-4 rotate-180 transition-transform"
              : "size-4 transition-transform"
          }
        />
        {isExpanded
          ? t("hideItems")
          : t("showItems", { count: order.items.length })}
      </Button>

      {isExpanded && (
        <div className="mt-3">
          <OrderItemsPanel items={order.items} compact />
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-content/45 text-xs font-semibold uppercase">
            {t("customer")}
          </dt>
          <dd className="text-content/65 mt-1 truncate text-xs">
            {order.user ? (
              <span className="text-content block truncate font-semibold">
                {order.user.firstName || order.user.lastName
                  ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                  : t("noName")}
              </span>
            ) : (
              <span className="block truncate font-mono">{order.userId}</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-content/45 text-xs font-semibold uppercase">
            {t("total")}
          </dt>
          <dd className="text-content mt-1 font-semibold tabular-nums">
            {currencyFormatter.format(order.totalAmount)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-content/45 text-xs font-semibold uppercase">
            {t("date")}
          </dt>
          <dd className="text-content/65 mt-1 tabular-nums">
            {dateFormatter.format(new Date(order.createdAt))}
          </dd>
        </div>
      </dl>
    </article>
  );
}
