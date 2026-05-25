"use client";

import Button from "@/components/atoms/button";
import { TSkuDomain } from "@/domain/products/types/products.model";
import { Check } from "lucide-react";

interface ProductSkuOptionsProps {
  skus: TSkuDomain[];
  selectedSkuId: string;
  onSelectedSkuChange: (skuId: string) => void;
}

export function ProductSkuOptions({
  skus,
  selectedSkuId,
  onSelectedSkuChange,
}: ProductSkuOptionsProps) {
  if (skus.length <= 1) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-content/60 w-24 text-sm font-medium">SKU</span>
      <div className="flex flex-wrap gap-2">
        {skus.map((sku) => {
          const isSelected = selectedSkuId === sku.id;

          return (
            <Button
              key={sku.id}
              variant="ghost"
              onPress={() => onSelectedSkuChange(sku.id)}
              className={`flex h-auto items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:opacity-100 active:scale-[0.98] ${
                isSelected
                  ? "border-primary text-primary bg-primary/5 hover:bg-primary/5"
                  : "border-content/[0.1] hover:border-content/20 text-content/80 hover:bg-transparent"
              }`}
            >
              {sku.skuCode || sku.id.slice(0, 8)}
              {isSelected && <Check className="h-3 w-3" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
