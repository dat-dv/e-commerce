"use client";

import { Button, EmptyState } from "@ecommerce/ui";
import { UI_RADIUS } from "@/constants/ui-radius";
import type { TFlashSaleTimeSlot } from "@/domain/flash-sales/types/flash-sale.model";
import { cn } from "@/utils/cn";
import { AlertTriangle, Clock3, Plus, RefreshCw, Rows3 } from "lucide-react";
import { useTranslations } from "next-intl";

function formatSlotTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function TimeSlotsTable({
  timeSlots,
  loading,
  hasError,
  onRetry,
  onCreate,
}: {
  timeSlots: TFlashSaleTimeSlot[];
  loading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onCreate: () => void;
}) {
  const t = useTranslations("AdminFlashSalesPage.timeSlots");

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-content text-lg font-semibold">{t("title")}</h2>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm">
            <Rows3 aria-hidden="true" className="size-4" />
            {t("createBatchBtn")}
          </Button>
          <Button type="button" size="sm" onClick={onCreate}>
            <Plus aria-hidden="true" className="size-4" />
            {t("createBtn")}
          </Button>
        </div>
      </div>

      <div
        className={`${UI_RADIUS.panel} border-content/[0.06] bg-surface/40 overflow-x-auto border shadow-[0_8px_30px_rgb(0,0,0,0.02)]`}
      >
        <table className="text-content w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-content/[0.06] bg-content/[0.02] text-content/45 border-b text-xs font-semibold tracking-wider uppercase">
              <th className="px-6 py-4">{t("name")}</th>
              <th className="px-6 py-4">{t("startHour")}</th>
              <th className="px-6 py-4">{t("endHour")}</th>
              <th className="px-6 py-4 text-center">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-content/50 px-6 py-12 text-center"
                >
                  {t("loading")}
                </td>
              </tr>
            ) : hasError ? (
              <tr>
                <td colSpan={4} className="px-6 py-6">
                  <EmptyState
                    title={t("error")}
                    description={t("error")}
                    icon={AlertTriangle}
                    className="border-0 bg-transparent py-10"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onRetry}
                      className="mt-6"
                    >
                      <RefreshCw aria-hidden="true" className="size-4" />
                      {t("retry")}
                    </Button>
                  </EmptyState>
                </td>
              </tr>
            ) : timeSlots.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-6">
                  <EmptyState
                    title={t("empty")}
                    description={t("empty")}
                    icon={Clock3}
                    className="border-0 bg-transparent py-10"
                  />
                </td>
              </tr>
            ) : (
              timeSlots.map((slot) => (
                <tr
                  key={slot.id}
                  className="border-content/[0.06] hover:bg-content/[0.015] border-b transition-colors"
                >
                  <td className="px-6 py-4 font-semibold">{slot.name}</td>
                  <td className="text-content/65 px-6 py-4 font-mono tabular-nums">
                    {formatSlotTime(slot.startHour, slot.startMinute)}
                  </td>
                  <td className="text-content/65 px-6 py-4 font-mono tabular-nums">
                    {formatSlotTime(slot.endHour, slot.endMinute)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        slot.isActive
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-content/10 text-content/55",
                      )}
                    >
                      {slot.isActive ? t("active") : t("inactive")}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
