import React from "react";
import Image from "next/image";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { TBrand } from "@/domain/products/types/products.model";

interface BrandInfoProps {
  brand?: TBrand;
}

export const BrandInfo = ({ brand }: BrandInfoProps) => {
  if (!brand) return null;

  return (
    <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-content/[0.05] flex items-center justify-center overflow-hidden border border-content/[0.05]">
          {brand.logo_url ? (
            <Image
              src={brand.logo_url}
              alt={brand.name}
              width={56}
              height={56}
              className="object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-content/40">
              {brand.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-content">{brand.name}</h3>
          <p className="text-xs text-content/50 line-clamp-2 max-w-md">
            {brand.description || "Authentic products from this brand"}
          </p>
        </div>
      </div>
      <Link
        href={APP_ROUTES.BRAND_DETAIL(brand.slug)}
        className="px-4 py-2 rounded-xl border border-content/[0.05] text-sm font-semibold hover:bg-content/[0.03] transition-colors"
      >
        View Store
      </Link>
    </div>
  );
};
