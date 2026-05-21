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
    <div className="bg-content/[0.02] flex items-center gap-4 rounded-xl p-4">
      {isDiscounted && (
        <span className="text-content/40 text-base line-through">
          {formatCurrency(originalPrice)}
        </span>
      )}
      <span className="text-primary text-3xl font-bold">
        {formatCurrency(price)}
      </span>
      {hasValidDiscountPercent && (
        <span className="bg-primary/10 text-primary rounded-lg px-2 py-0.5 text-xs font-bold">
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}
