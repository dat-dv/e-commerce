"use client";

import { Button } from "@ecommerce/ui";
import { TProduct } from "@/domain/products/types/products.model";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductRatingSummaryProps {
  product: TProduct;
  rating: number;
  reviewsCount: number;
}

export function ProductRatingSummary({
  product,
  rating,
  reviewsCount,
}: ProductRatingSummaryProps) {
  const t = useTranslations("ProductDetailPage");
  const roundedRating = Math.floor(rating);

  return (
    <div className="border-content/[0.05] flex items-center justify-between border-b pb-4 text-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-primary text-base font-bold">
            {rating.toFixed(1)}
          </span>
          <div className="text-primary flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={14}
                fill={index < roundedRating ? "currentColor" : "none"}
                className={index < roundedRating ? "" : "text-primary/20"}
              />
            ))}
          </div>
        </div>

        <div className="bg-content/[0.1] h-4 w-[1px]" />

        <div className="flex items-center gap-1">
          <span className="text-content font-bold">{reviewsCount}</span>
          <span className="text-content/50 text-xs">{t("reviews")}</span>
        </div>

        <div className="bg-content/[0.1] h-4 w-[1px]" />

        <div className="flex items-center gap-1">
          <span className="text-content font-bold">
            {product.soldCount || 0}
          </span>
          <span className="text-content/50 text-xs">{t("sold")}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        className="text-content/40 hover:text-content h-auto px-0 text-xs font-medium transition-colors hover:bg-transparent active:scale-100"
      >
        {t("report")}
      </Button>
    </div>
  );
}
