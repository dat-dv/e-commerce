"use client";

import { TBrand } from "@/domain/homepage/types/homepage.model";
import { useTranslations } from "next-intl";

interface IBrandProductHeaderProps {
  brand: TBrand;
}

export function BrandProductHeader({ brand }: IBrandProductHeaderProps) {
  const t = useTranslations("BrandsPage.detail.products");

  return (
    <div className="border-content/10 flex flex-col justify-between gap-5 border-b pb-8 md:flex-row md:items-end md:gap-6 md:pb-12">
      <div className="flex min-w-0 flex-col gap-4">
        <h2 className="text-content text-3xl font-black tracking-normal break-words uppercase sm:text-4xl md:text-5xl">
          {brand.name}{" "}
          <span className="text-content/30 font-light italic">
            {t("archive")}
          </span>
        </h2>
      </div>
      <p className="text-content/50 max-w-xs text-sm font-medium italic">
        {t("description", { brand: brand.name })}
      </p>
    </div>
  );
}
