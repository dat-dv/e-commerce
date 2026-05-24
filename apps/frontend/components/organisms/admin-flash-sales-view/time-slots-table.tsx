"use client";

import Button from "@/components/atoms/button";
import { UI_RADIUS } from "@/constants/ui-radius";
import { Clock3, Plus, Rows3 } from "lucide-react";
import { useTranslations } from "next-intl";

export function TimeSlotsTable() {
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
          <Button type="button" size="sm">
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
            <tr>
              <td
                colSpan={4}
                className="text-content/50 px-6 py-12 text-center"
              >
                <Clock3 aria-hidden="true" className="mx-auto mb-3 size-5" />
                {t("title")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
