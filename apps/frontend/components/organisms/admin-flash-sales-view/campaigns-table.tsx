"use client";

import { Button, EmptyState } from "@ecommerce/ui";
import { UI_RADIUS } from "@/constants/ui-radius";
import type { TFlashSale } from "@/domain/flash-sales/types/flash-sale.model";
import { cn } from "@/utils/cn";
import {
  AlertTriangle,
  PackageOpen,
  Plus,
  RefreshCw,
  Rows3,
  Tags,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import Link from "next/link";

function getFlashSaleStatus(flashSale: TFlashSale) {
  const now = Date.now();
  const startTime = new Date(flashSale.startTime).getTime();
  const endTime = new Date(flashSale.endTime).getTime();

  if (now < startTime) return "upcoming";
  if (now > endTime) return "ended";
  return "active";
}

export function CampaignsTable({
  flashSales,
  loading,
  hasError,
  onRetry,
  onCreate,
  onAttachProducts,
}: {
  flashSales: TFlashSale[];
  loading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onCreate: () => void;
  onAttachProducts: (flashSaleId?: string) => void;
}) {
  const t = useTranslations("AdminFlashSalesPage.campaigns");
  const locale = useLocale();
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-content text-lg font-semibold">{t("title")}</h2>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm">
            <Rows3 aria-hidden="true" className="size-4" />
            {t("createBatchBtn")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onAttachProducts()}
          >
            <Tags aria-hidden="true" className="size-4" />
            {t("attachProductBtn")}
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
        <table className="text-content w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-content/[0.06] bg-content/[0.02] text-content/45 border-b text-xs font-semibold tracking-wider uppercase">
              <th className="px-6 py-4">{t("name")}</th>
              <th className="px-6 py-4">{t("startTime")}</th>
              <th className="px-6 py-4">{t("endTime")}</th>
              <th className="px-6 py-4 text-center">{t("status")}</th>
              <th className="px-6 py-4 text-right">{t("products")}</th>
              <th className="px-6 py-4 text-right">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-content/50 px-6 py-12 text-center"
                >
                  {t("loading")}
                </td>
              </tr>
            ) : hasError ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">
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
            ) : flashSales.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">
                  <EmptyState
                    title={t("empty")}
                    description={t("empty")}
                    icon={PackageOpen}
                    className="border-0 bg-transparent py-10"
                  />
                </td>
              </tr>
            ) : (
              flashSales.map((flashSale) => {
                const status = getFlashSaleStatus(flashSale);

                return (
                  <tr
                    key={flashSale.id}
                    className="border-content/[0.06] hover:bg-content/[0.015] border-b transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/flash-sales/${flashSale.id}`}
                          className="hover:text-primary font-semibold transition-colors duration-200"
                        >
                          {flashSale.name}
                        </Link>
                        {flashSale.timeSlot && (
                          <span className="text-content/50 text-xs">
                            {flashSale.timeSlot.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-content/65 px-6 py-4 tabular-nums">
                      {dateFormatter.format(new Date(flashSale.startTime))}
                    </td>
                    <td className="text-content/65 px-6 py-4 tabular-nums">
                      {dateFormatter.format(new Date(flashSale.endTime))}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          status === "active" &&
                            "bg-emerald-500/10 text-emerald-600",
                          status === "upcoming" &&
                            "bg-amber-500/10 text-amber-600",
                          status === "ended" && "bg-content/10 text-content/55",
                        )}
                      >
                        {t(`statusLabel.${status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold tabular-nums">
                      {flashSale.products.length}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onAttachProducts(flashSale.id)}
                      >
                        <Tags aria-hidden="true" className="size-4" />
                        {t("attachProductBtn")}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
