import { Grid, X } from "lucide-react";

import type { IAdminCategory, IAdminProduct } from "@/domain/product";

interface IProductCategoriesFieldProps {
  product: IAdminProduct;
  flatCategories: Array<IAdminCategory & { depth: number }>;
  editCategoryIds: string[];
  isEditing: boolean;
  metadataLoading: boolean;
  metadataError?: string | null;
  onToggleCategory?: (categoryId: string) => void;
}

export const getCategoryName = (category?: IAdminCategory) =>
  category?.translations?.[0]?.name || category?.slug || "";

export const ProductCategoriesField = ({
  product,
  flatCategories,
  editCategoryIds,
  isEditing,
  metadataLoading,
  metadataError,
  onToggleCategory,
}: IProductCategoriesFieldProps) => {
  return (
    <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
        <Grid className="h-4 w-4" />
        Categories
      </div>
      {isEditing && (
        <p className="text-primary mt-1 text-xs font-semibold">
          {editCategoryIds.length} selected
        </p>
      )}
      {isEditing ? (
        <div className="mt-2 max-h-44 space-y-1 overflow-y-auto pr-1">
          {metadataLoading ? (
            <p className="text-sm text-[var(--muted)]">Loading categories...</p>
          ) : flatCategories.length > 0 ? (
            flatCategories.map((category) => (
              <label
                key={category.id}
                className="hover:bg-content/[0.04] flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm text-[var(--app-text)]"
                style={{ paddingLeft: `${category.depth * 14 + 8}px` }}
              >
                <input
                  type="checkbox"
                  checked={editCategoryIds.includes(category.id)}
                  onChange={() => onToggleCategory?.(category.id)}
                  className="accent-primary h-4 w-4"
                />
                <span className="min-w-0 truncate">
                  {getCategoryName(category)}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">
              No categories available.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-1 flex flex-wrap gap-1">
          {product.categories && product.categories.length > 0 ? (
            product.categories.map((c) => {
              const label = getCategoryName(c.category) || c.categoryId;
              return (
                <span
                  key={c.categoryId}
                  className="bg-content/5 rounded px-2 py-0.5 text-xs text-[var(--app-text)]"
                >
                  {label}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-[var(--muted)]">—</span>
          )}
        </div>
      )}
      {metadataError && isEditing && (
        <p className="mt-2 text-xs font-semibold text-red-300">
          {metadataError}
        </p>
      )}
      {isEditing && editCategoryIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {editCategoryIds.map((categoryId) => {
            const category = flatCategories.find(
              (item) => item.id === categoryId,
            );
            return (
              <button
                key={categoryId}
                type="button"
                onClick={() => onToggleCategory?.(categoryId)}
                className="bg-primary/10 text-primary hover:bg-primary/15 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold transition-colors"
                aria-label={`Remove category ${getCategoryName(category) || categoryId}`}
              >
                {getCategoryName(category) || categoryId}
                <X className="h-3 w-3" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
