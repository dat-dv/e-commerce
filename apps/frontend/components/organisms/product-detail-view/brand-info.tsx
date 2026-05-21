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
    <div className="group border-content/[0.06] bg-surface hover:border-content/[0.1] relative overflow-hidden rounded-2xl border px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* glow */}
      <div className="bg-primary/5 absolute top-0 right-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-center justify-between gap-3">
        {/* left */}
        <div className="flex min-w-0 items-center gap-3">
          {/* logo */}
          <div className="border-content/[0.05] bg-content/[0.02] flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-2 sm:h-16 sm:w-16">
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
              <span className="text-content/10 text-xl font-bold uppercase">
                {brand.name.charAt(0)}
              </span>
            )}
          </div>

          {/* content */}
          <div className="min-w-0">
            <h3 className="text-content truncate text-sm font-bold sm:text-base">
              {brand.name}
            </h3>

            <p className="text-content/50 mt-0.5 line-clamp-1 text-xs sm:line-clamp-2">
              {brand.description || t("authenticProduct")}
            </p>
          </div>
        </div>

        {/* action */}
        <Link
          href={APP_ROUTES.BRAND_DETAIL(brand.slug)}
          className="border-content/[0.06] text-content/80 hover:bg-content/[0.03] hover:text-content shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 active:scale-95 sm:px-4"
        >
          {t("viewStore")}
        </Link>
      </div>
    </div>
  );
};
