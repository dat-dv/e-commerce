"use client";

import { Button } from "@ecommerce/ui";
import { AppStatusDropdown } from "@/components/molecules/app-status-dropdown";
import { OrderItemsPanel } from "@/components/molecules/order-part/order-items-panel";
import { TOrder } from "@/domain/orders/types/order.model";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Fragment, useMemo } from "react";
import type { Key } from "react-aria-components";

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
    <div className="border-content/[0.06] bg-surface/40 overflow-x-auto rounded-xl border shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <table className="text-content w-full min-w-[1000px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-content/[0.06] bg-content/[0.02] text-content/45 border-b text-xs font-semibold tracking-wider uppercase">
            <th className="w-16 px-6 py-4 text-center">{t("stt")}</th>
            <th className="px-6 py-4">{t("orderId")}</th>
            <th className="px-6 py-4">{t("customer")}</th>
            <th className="px-6 py-4">{t("date")}</th>
            <th className="px-6 py-4 text-right">{t("total")}</th>
            <th className="px-6 py-4 text-center">{t("status")}</th>
          </tr>
        </thead>
        <tbody className="divide-content/[0.06] divide-y">
          {orders.map((order, index) => {
            const isExpanded = expandedOrderIds.has(order.id);
            const isUpdating = updatingId === order.id;

            return (
              <Fragment key={order.id}>
                <tr
                  className={cn(
                    "hover:bg-content/[0.015] align-middle transition-colors duration-150",
                    isExpanded && "bg-content/[0.005]",
                  )}
                >
                  <td className="text-content/50 border-content/[0.03] w-16 border-r px-6 py-4 text-center font-mono text-xs font-medium">
                    {(page - 1) * 10 + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onExpandedToggle(order.id)}
                        className="text-content/50 hover:bg-content/5 hover:text-content inline-flex size-6 h-auto items-center justify-center rounded-md p-0 opacity-100 transition-colors hover:opacity-100 focus-visible:outline-none active:scale-95"
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
                        <span className="text-content max-w-44 truncate font-semibold">
                          {order.user.firstName || order.user.lastName
                            ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                            : t("noName")}
                        </span>
                        <span className="text-content/50 max-w-44 truncate text-xs">
                          {order.user.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-content/65 block max-w-44 truncate font-mono text-xs">
                        {order.userId}
                      </span>
                    )}
                  </td>
                  <td className="text-content/65 px-6 py-4 tabular-nums">
                    {dateFormatter.format(new Date(order.createdAt))}
                  </td>
                  <td className="text-content px-6 py-4 text-right font-semibold tabular-nums">
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
                    <td colSpan={6} className="bg-content/[0.01] p-3">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-1 pb-3">
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
  );
}
