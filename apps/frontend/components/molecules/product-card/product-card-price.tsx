"use client";

import { TYPOGRAPHY } from "@/constants/typography";

interface ProductCardPriceProps {
  price: string;
  originalPrice?: string;
  hasOriginalPrice?: boolean;
  priceClassName: string;
}

export function ProductCardPrice({
  price,
  originalPrice,
  hasOriginalPrice = false,
  priceClassName,
}: ProductCardPriceProps) {
  return (
    <div className="flex flex-col">
      <span className={`text-base font-black tracking-tight ${priceClassName}`}>
        {price}
      </span>
      {hasOriginalPrice ? (
        <span
          className={`${TYPOGRAPHY.badge} text-content/20 line-through font-medium`}
        >
          {originalPrice}
        </span>
      ) : null}
    </div>
  );
}
