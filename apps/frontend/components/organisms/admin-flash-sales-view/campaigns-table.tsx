"use client";

import Button from "@/components/atoms/button";
import { UI_RADIUS } from "@/constants/ui-radius";
import { Plus, Rows3, Tags } from "lucide-react";
import { useTranslations } from "next-intl";

export function CampaignsTable() {
  const t = useTranslations("AdminFlashSalesPage.campaigns");

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-content text-lg font-semibold">{t("title")}</h2>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm">
            <Rows3 aria-hidden="true" className="size-4" />
            {t("createBatchBtn")}
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <Tags aria-hidden="true" className="size-4" />
            {t("attachProductBtn")}
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
            <tr>
              <td
                colSpan={6}
                className="text-content/50 px-6 py-12 text-center"
              >
                {t("title")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
