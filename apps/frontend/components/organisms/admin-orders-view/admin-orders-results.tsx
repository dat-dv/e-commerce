"use client";

import Button from "@/components/atoms/button";
import { AppStatusDropdown } from "@/components/molecules/app-status-dropdown";
import { OrderItemsPanel } from "@/components/molecules/order-part/order-items-panel";
import { TOrder } from "@/domain/orders/types/order.model";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Fragment, useMemo } from "react";
import type { Key } from "react-aria-components";

import { OrderCompactCard } from "./order-compact-card";
import { OrderIdCell } from "./order-id-cell";

export function OrderResults({
  orders,
  page,
  updatingId,
  expandedOrderIds,
  onCopy,
  onExpandedToggle,
  onStatusUpdate,
}: {
  orders: TOrder[];
  page: number;
  updatingId: string | null;
  expandedOrderIds: Set<Key>;
  onCopy: (text: string) => void;
  onExpandedToggle: (orderId: string) => void;
  onStatusUpdate: (orderId: string, newStatus: number) => void;
}) {
  const t = useTranslations("AdminOrdersPage.results");
  const locale = useLocale();

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
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-content/[0.06] bg-surface/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:block">
        <table className="w-full border-collapse text-left text-sm text-content">
          <thead>
            <tr className="border-b border-content/[0.06] bg-content/[0.02] text-xs font-semibold uppercase tracking-wider text-content/45">
              <th className="px-6 py-4 text-center w-16">{t("stt")}</th>
              <th className="px-6 py-4">{t("orderId")}</th>
              <th className="px-6 py-4">{t("customer")}</th>
              <th className="px-6 py-4">{t("date")}</th>
              <th className="px-6 py-4 text-right">{t("total")}</th>
              <th className="px-6 py-4 text-center">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-content/[0.06]">
            {orders.map((order, index) => {
              const isExpanded = expandedOrderIds.has(order.id);
              const isUpdating = updatingId === order.id;

              return (
                <Fragment key={order.id}>
                  <tr
                    className={cn(
                      "transition-colors duration-150 hover:bg-content/[0.015] align-middle",
                      isExpanded && "bg-content/[0.005]",
                    )}
                  >
                    <td className="px-6 py-4 text-center text-content/50 font-medium font-mono text-xs w-16 border-r border-content/[0.03]">
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => onExpandedToggle(order.id)}
                          className="inline-flex size-6 items-center justify-center rounded-md text-content/50 transition-colors hover:bg-content/5 hover:text-content focus-visible:outline-none h-auto p-0 active:scale-95 opacity-100 hover:opacity-100"
                        >
                          <ChevronRight
                            aria-hidden="true"
                            className={cn(
                              "size-4 transition-transform duration-200",
                              isExpanded && "rotate-90",
                            )}
                          />
                        </Button>
                        <OrderIdCell orderId={order.id} onCopy={onCopy} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.user ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-content max-w-44 truncate">
                            {order.user.firstName || order.user.lastName
                              ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                              : t("noName")}
                          </span>
                          <span className="text-xs text-content/50 max-w-44 truncate">
                            {order.user.email}
                          </span>
                        </div>
                      ) : (
                        <span className="block max-w-44 truncate font-mono text-xs text-content/65">
                          {order.userId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 tabular-nums text-content/65">
                      {dateFormatter.format(new Date(order.createdAt))}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold tabular-nums text-content">
                      {currencyFormatter.format(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <AppStatusDropdown
                        orderId={order.id}
                        status={order.status}
                        disabled={isUpdating}
                        onStatusUpdate={onStatusUpdate}
                      />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-content/[0.005]">
                      <td colSpan={6} className="p-3 bg-content/[0.01]">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 pt-1">
                            <OrderItemsPanel items={order.items} />
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {orders.map((order) => (
          <OrderCompactCard
            key={order.id}
            order={order}
            updatingId={updatingId}
            isExpanded={expandedOrderIds.has(order.id)}
            onCopy={onCopy}
            onExpandedToggle={onExpandedToggle}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </>
  );
}
