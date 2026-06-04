import { Select } from "@ecommerce/ui";
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
        <Select
          aria-label="Product brand"
          placeholder={metadataLoading ? "Loading brands..." : "Select brand"}
          selectedKey={editBrandId || undefined}
          onSelectionChange={(key) => onBrandChange?.(String(key))}
          isDisabled={metadataLoading || brands.length === 0}
          options={brands.map((brand) => ({
            label: getBrandName(brand),
            value: brand.id,
          }))}
          className="mt-1"
          size="sm"
        />
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
