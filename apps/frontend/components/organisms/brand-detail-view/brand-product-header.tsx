"use client";

import { TBrand } from "@/domain/homepage/types/homepage.model";
import { useTranslations } from "next-intl";

interface IBrandProductHeaderProps {
  brand: TBrand;
}

export function BrandProductHeader({ brand }: IBrandProductHeaderProps) {
  const t = useTranslations("BrandsPage.detail.products");

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-content/10 pb-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-5xl font-black tracking-tighter text-content uppercase">
          {brand.name}{" "}
          <span className="italic font-light text-content/30">
            {t("archive")}
          </span>
        </h2>
      </div>
      <p className="text-content/50 font-medium max-w-xs text-sm italic">
        {t("description", { brand: brand.name })}
      </p>
    </div>
  );
}
