"use client";

import { QuantitySelector } from "@/components/molecules/quantity-selector";
import { TSkuDomain } from "@/domain/products/types/products.model";
import { useTranslations } from "next-intl";

interface ProductQuantitySelectorProps {
  selectedSku: TSkuDomain;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductQuantitySelector({
  selectedSku,
  quantity,
  onQuantityChange,
}: ProductQuantitySelectorProps) {
  const t = useTranslations("ProductDetailPage");
  const maxStock = selectedSku?.stock ?? Infinity;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-content/60 w-24 text-sm font-medium">
        {t("quantity")}
      </span>
      <div className="flex items-center gap-4">
        <QuantitySelector
          value={quantity}
          onChange={onQuantityChange}
          max={maxStock}
          className="h-9"
          inputClassName="w-12 font-semibold"
        />
        <span className="text-content/50 text-sm">
          {selectedSku?.stock !== undefined
            ? t("itemsAvailable", { count: String(selectedSku.stock) })
            : t("inStock")}
        </span>
      </div>
    </div>
  );
}
