"use client";

import { useTranslations } from "next-intl";

interface CategoriesContentHeaderProps {
  count: number;
}

export const CategoriesContentHeader = ({
  count,
}: CategoriesContentHeaderProps) => {
  const t = useTranslations("CategoriesPage.content");

  return (
    <div className="border-content/[0.04] hidden min-w-0 flex-col gap-2 border-b pb-4 lg:flex lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h3 className="text-content text-xl font-black tracking-tight sm:text-2xl">
          {t("title")}
        </h3>
        <p className="text-content/45 mt-1 text-sm font-medium">
          {t("description")}
        </p>
      </div>

      <p className="text-content/40 shrink-0 text-xs font-bold">
        {t("count", { count })}
      </p>
    </div>
  );
};
