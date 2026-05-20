"use client";

import Button from "@/components/atoms/button";
import { AppStatusDropdown } from "@/components/molecules/app-status-dropdown";
import { OrderItemsPanel } from "@/components/molecules/order-part/order-items-panel";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import { getOrderPreview } from "./admin-orders.utils";
import { AdminOrderRowProps } from "./admin-orders.types";
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
    <article className="rounded-xl border border-content/[0.06] bg-surface/40 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-content/45">
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
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-content/15 text-sm font-semibold text-content hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 opacity-100 hover:opacity-100"
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
          <dt className="text-xs font-semibold uppercase text-content/45">
            {t("customer")}
          </dt>
          <dd className="mt-1 truncate text-xs text-content/65">
            {order.user ? (
              <span className="font-semibold text-content block truncate">
                {order.user.firstName || order.user.lastName
                  ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                  : t("noName")}
              </span>
            ) : (
              <span className="font-mono block truncate">{order.userId}</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-content/45">
            {t("total")}
          </dt>
          <dd className="mt-1 font-semibold tabular-nums text-content">
            {currencyFormatter.format(order.totalAmount)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs font-semibold uppercase text-content/45">
            {t("date")}
          </dt>
          <dd className="mt-1 tabular-nums text-content/65">
            {dateFormatter.format(new Date(order.createdAt))}
          </dd>
        </div>
      </dl>
    </article>
  );
}
