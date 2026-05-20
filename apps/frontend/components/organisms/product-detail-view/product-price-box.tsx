"use client";

import { formatCurrency } from "@/utils/format-currency";

interface ProductPriceBoxProps {
  originalPrice: number;
  price: number;
  discountPercent: number;
}

export function ProductPriceBox({
  originalPrice,
  price,
  discountPercent,
}: ProductPriceBoxProps) {
  const isDiscounted = originalPrice > price;
  const hasValidDiscountPercent = isDiscounted && discountPercent > 0;

  return (
    <div className="bg-content/[0.02] p-4 rounded-xl flex items-center gap-4">
      {isDiscounted && (
        <span className="text-content/40 line-through text-base">
          {formatCurrency(originalPrice)}
        </span>
      )}
      <span className="text-3xl font-bold text-primary">
        {formatCurrency(price)}
      </span>
      {hasValidDiscountPercent && (
        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-lg">
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}
