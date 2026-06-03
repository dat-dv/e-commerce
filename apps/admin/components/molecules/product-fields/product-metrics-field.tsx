import { Star } from "lucide-react";

import type { IAdminProduct } from "@/domain/product";

interface IProductMetricsFieldProps {
  product: IAdminProduct;
}

export const ProductMetricsField = ({ product }: IProductMetricsFieldProps) => {
  return (
    <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4 sm:col-span-2">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
        <Star className="h-4 w-4" />
        Performance Metrics
      </div>
      <div className="flex items-center gap-4 text-sm text-[var(--app-text)]">
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <b>{product.rating.toFixed(1)}</b>
        </span>
        <span>
          Sold: <b>{product.soldCount}</b>
        </span>
        <span>
          Reviews: <b>{product.reviewCount}</b>
        </span>
      </div>
    </div>
  );
};
