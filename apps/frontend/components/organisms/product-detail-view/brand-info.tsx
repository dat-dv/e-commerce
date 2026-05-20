import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { APP_ROUTES } from "@/constants/routes";
import { TBrand } from "@/domain/products/types/products.model";

interface BrandInfoProps {
  brand?: TBrand;
}

export const BrandInfo = ({ brand }: BrandInfoProps) => {
  const t = useTranslations("ProductDetailPage");

  if (!brand) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-content/[0.06] bg-surface px-4 py-3 shadow-sm transition-all duration-300 hover:border-content/[0.1] hover:shadow-md">
      {/* glow */}
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/5 blur-2xl transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-center justify-between gap-3">
        {/* left */}
        <div className="flex min-w-0 items-center gap-3">
          {/* logo */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-content/[0.05] bg-content/[0.02] p-2 sm:h-16 sm:w-16">
            {brand.logoUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-xl font-bold uppercase text-content/10">
                {brand.name.charAt(0)}
              </span>
            )}
          </div>

          {/* content */}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-content sm:text-base">
              {brand.name}
            </h3>

            <p className="mt-0.5 line-clamp-1 text-xs text-content/50 sm:line-clamp-2">
              {brand.description || t("authenticProduct")}
            </p>
          </div>
        </div>

        {/* action */}
        <Link
          href={APP_ROUTES.BRAND_DETAIL(brand.slug)}
          className="shrink-0 rounded-xl border border-content/[0.06] px-3 py-2 text-xs font-semibold text-content/80 transition-all duration-300 hover:bg-content/[0.03] hover:text-content active:scale-95 sm:px-4"
        >
          {t("viewStore")}
        </Link>
      </div>
    </div>
  );
};
