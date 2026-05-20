"use client";

import { TBrand } from "@/domain/homepage/types/homepage.model";
import { useTranslations } from "next-intl";

interface IBrandProductHeaderProps {
  brand: TBrand;
}

export function BrandProductHeader({ brand }: IBrandProductHeaderProps) {
  const t = useTranslations("BrandsPage.detail.products");

  return (
    <div className="flex flex-col justify-between gap-5 border-b border-content/10 pb-8 md:flex-row md:items-end md:gap-6 md:pb-12">
      <div className="flex min-w-0 flex-col gap-4">
        <h2 className="break-words text-3xl font-black uppercase tracking-normal text-content sm:text-4xl md:text-5xl">
          {brand.name}{" "}
          <span className="italic font-light text-content/30">
            {t("archive")}
          </span>
        </h2>
      </div>
      <p className="max-w-xs text-sm font-medium italic text-content/50">
        {t("description", { brand: brand.name })}
      </p>
    </div>
  );
}
