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
    <div className="hidden min-w-0 flex-col gap-2 border-b border-content/[0.04] pb-4 lg:flex lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h3 className="text-xl font-black tracking-tight text-content sm:text-2xl">
          {t("title")}
        </h3>
        <p className="mt-1 text-sm font-medium text-content/45">
          {t("description")}
        </p>
      </div>

      <p className="shrink-0 text-xs font-bold text-content/40">
        {t("count", { count })}
      </p>
    </div>
  );
};
