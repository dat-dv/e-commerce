import { Award } from "lucide-react";

import type { IAdminBrand, IAdminProduct } from "@/domain/product";

interface IProductBrandFieldProps {
  product: IAdminProduct;
  brands: IAdminBrand[];
  editBrandId: string;
  isEditing: boolean;
  metadataLoading: boolean;
  onBrandChange?: (brandId: string) => void;
}

export const getBrandName = (brand: IAdminBrand) =>
  brand.translations?.[0]?.name || brand.slug;

export const ProductBrandField = ({
  product,
  brands,
  editBrandId,
  isEditing,
  metadataLoading,
  onBrandChange,
}: IProductBrandFieldProps) => {
  return (
    <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
        <Award className="h-4 w-4" />
        Brand
      </div>
      {isEditing ? (
        <select
          value={editBrandId}
          onChange={(e) => onBrandChange?.(e.target.value)}
          disabled={metadataLoading || brands.length === 0}
          className="focus:border-primary mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2.5 py-1.5 text-sm text-[var(--app-text)] focus:outline-none disabled:opacity-50"
        >
          <option value="">
            {metadataLoading ? "Loading brands..." : "Select brand"}
          </option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {getBrandName(brand)}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-sm font-semibold text-[var(--app-text)]">
          {product.brand?.slug ? (
            <span>{getBrandName(product.brand)}</span>
          ) : (
            <span className="text-[var(--muted)]">—</span>
          )}
        </p>
      )}
    </div>
  );
};
