import { APP_ROUTES } from "@/constants/routes";
import { TBrand } from "@/domain/products/types/products.model";
import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

interface BrandInfoProps {
  brand?: TBrand;
}

export const BrandInfo = ({ brand }: BrandInfoProps) => {
  const t = useTranslations("ProductDetailPage");
  if (!brand) return null;

  return (
    <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-content/[0.02] border border-content/[0.05] flex items-center justify-center p-2">
          {brand.logoUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 80px, 96px"
                className="object-contain"
              />
            </div>
          ) : (
            <span className="text-2xl font-bold text-content/10 uppercase">
              {brand.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-content">{brand.name}</h3>
          <p className="text-xs text-content/50 line-clamp-2 max-w-md">
            {brand.description || t("authenticProduct")}
          </p>
        </div>
      </div>
      <Link
        href={APP_ROUTES.BRAND_DETAIL(brand.slug)}
        className="px-4 py-2 rounded-xl border border-content/[0.05] text-sm font-semibold hover:bg-content/[0.03] transition-colors"
      >
        {t("viewStore")}
      </Link>
    </div>
  );
};
