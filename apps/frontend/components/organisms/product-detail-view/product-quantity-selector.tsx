"use client";

import Button from "@/components/atoms/button";
import { TSkuDomain } from "@/domain/products/types/products.model";
import { Minus, Plus } from "lucide-react";
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

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-content/60 w-24">
        {t("quantity")}
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-content/[0.1] rounded-lg overflow-hidden h-9">
          <Button
            variant="ghost"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="h-full px-3 hover:bg-content/[0.05] transition-colors rounded-none border-r border-r-content/[0.1] active:scale-100 hover:opacity-100 text-content opacity-100 font-normal"
          >
            <Minus size={12} />
          </Button>
          <span className="px-4 font-semibold text-sm min-w-[40px] text-center">
            {quantity}
          </span>
          <Button
            variant="ghost"
            onClick={() => onQuantityChange(quantity + 1)}
            className="h-full px-3 hover:bg-content/[0.05] transition-colors rounded-none border-l border-l-content/[0.1] active:scale-100 hover:opacity-100 text-content opacity-100 font-normal"
          >
            <Plus size={12} />
          </Button>
        </div>
        <span className="text-sm text-content/50">
          {selectedSku?.stock !== undefined
            ? t("itemsAvailable", { count: String(selectedSku.stock) })
            : t("inStock")}
        </span>
      </div>
    </div>
  );
}
