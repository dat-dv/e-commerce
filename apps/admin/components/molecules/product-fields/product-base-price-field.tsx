import { Tag } from "lucide-react";

import { formatCurrency } from "@/components/organisms/products-view/product.utils";

interface IProductBasePriceFieldProps {
  basePrice: number;
  editPrice: number;
  isEditing: boolean;
  onPriceChange?: (price: number) => void;
}

export const ProductBasePriceField = ({
  basePrice,
  editPrice,
  isEditing,
  onPriceChange,
}: IProductBasePriceFieldProps) => {
  return (
    <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
        <Tag className="h-4 w-4" />
        Base Price
      </div>
      {isEditing ? (
        <input
          type="number"
          value={editPrice}
          onChange={(e) => onPriceChange?.(Number(e.target.value))}
          className="focus:border-primary mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2.5 py-1.5 text-sm font-semibold text-emerald-400 focus:outline-none"
        />
      ) : (
        <p className="text-lg font-extrabold text-emerald-400">
          {formatCurrency(basePrice)}
        </p>
      )}
    </div>
  );
};
