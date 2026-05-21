"use client";

import { APP_ROUTES } from "@/constants/routes";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const BrandCard = ({
  brand,
}: {
  brand: TBrand;
  isLarge: boolean;
  index?: number;
}) => {
  const t = useTranslations("BrandsPage.card");
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="group relative h-full min-w-0 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0">
      <Link
        href={APP_ROUTES.BRAND_DETAIL(brand.slug)}
        className={cn(
          UI_RADIUS.card,
          "relative flex h-full min-h-[220px] flex-col overflow-hidden border border-content/[0.08] bg-background shadow-sm transition-all duration-300 group-hover:border-primary/35 group-hover:shadow-lg group-hover:shadow-primary/10",
        )}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {brand.bannerUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={brand.bannerUrl}
                alt={brand.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-[0.15] grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full bg-content/[0.02]" />
          )}
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex h-full min-w-0 flex-col justify-between gap-6 p-5">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div
              className={cn(
                UI_RADIUS.media,
                "flex h-14 w-14 shrink-0 items-center justify-center border border-content/[0.06] bg-background p-3 shadow-sm transition-transform duration-300 group-hover:rotate-[-3deg]",
              )}
            >
              {brand.logoUrl && !imgError ? (
                <div className="relative w-full h-full">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <span className="text-xl font-bold text-primary">
                  {brand.name?.charAt(0)}
                </span>
              )}
            </div>

            <div
              className={cn(
                UI_RADIUS.badge,
                "min-w-0 max-w-[8rem] border border-content/[0.06] bg-content/[0.03] px-2.5 py-1",
              )}
            >
              <span className="block truncate text-[10px] font-bold uppercase tracking-wide text-content/45">
                {t("productCount", { count: brand.productCount || 0 })}
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-xl font-bold leading-tight text-content transition-colors duration-300 group-hover:text-primary">
                {brand.name}
              </h3>
            </div>

            {brand.description && (
              <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-content/55">
                {brand.description}
              </p>
            )}

            <div className="mt-5 flex min-w-0 items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-primary">
              <span className="truncate">{t("viewArchive")}</span>
              <div className="h-px w-8 shrink-0 bg-primary/30 transition-all duration-300 group-hover:w-10" />
            </div>
          </div>
        </div>

        {/* Glass Reflection Effect */}
        <div className="pointer-events-none absolute left-0 top-0 h-1/2 w-full bg-gradient-to-b from-white/[0.05] to-transparent" />

        {/* Decorative Shine */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </div>
  );
};
