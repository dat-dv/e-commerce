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
      <span className="text-content/60 w-24 text-sm font-medium">
        {t("quantity")}
      </span>
      <div className="flex items-center gap-4">
        <div className="border-content/[0.1] flex h-9 items-center overflow-hidden rounded-lg border">
          <Button
            variant="ghost"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="hover:bg-content/[0.05] border-r-content/[0.1] text-content h-full rounded-none border-r px-3 font-normal opacity-100 transition-colors hover:opacity-100 active:scale-100"
          >
            <Minus size={12} />
          </Button>
          <span className="min-w-[40px] px-4 text-center text-sm font-semibold">
            {quantity}
          </span>
          <Button
            variant="ghost"
            onClick={() => onQuantityChange(quantity + 1)}
            className="hover:bg-content/[0.05] border-l-content/[0.1] text-content h-full rounded-none border-l px-3 font-normal opacity-100 transition-colors hover:opacity-100 active:scale-100"
          >
            <Plus size={12} />
          </Button>
        </div>
        <span className="text-content/50 text-sm">
          {selectedSku?.stock !== undefined
            ? t("itemsAvailable", { count: String(selectedSku.stock) })
            : t("inStock")}
        </span>
      </div>
    </div>
  );
}
