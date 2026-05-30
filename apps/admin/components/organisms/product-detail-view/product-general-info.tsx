import {
  type IBrandResponse,
  type ICategoryResponse,
  type ICategoryTreeResponse,
  type IProductResponse,
  type IUpdateProductSkuRequest,
} from "@ecommerce/shared";
import { Activity, Award, Grid, Package, Star, Tag, X } from "lucide-react";

import { formatCurrency, getProductName } from "../products-view/product.utils";
import { ProductSkuTable } from "./product-sku-table";

interface IProductGeneralInfoProps {
  product: IProductResponse;
  brands?: IBrandResponse[];
  categoryTree?: ICategoryTreeResponse;
  metadataLoading?: boolean;
  metadataError?: string | null;
  isEditing?: boolean;
  editPrice?: number;
  setEditPrice?: (p: number) => void;
  editStatus?: number;
  setEditStatus?: (s: number) => void;
  editBrandId?: string;
  setEditBrandId?: (brandId: string) => void;
  editCategoryIds?: string[];
  setEditCategoryIds?: (categoryIds: string[]) => void;
  editSkus?: IUpdateProductSkuRequest[];
  setEditSkus?: (skus: IUpdateProductSkuRequest[]) => void;
  deletedSkuIds?: string[];
  setDeletedSkuIds?: (skuIds: string[]) => void;
}

const getBrandName = (brand: IBrandResponse) =>
  brand.translations?.[0]?.name || brand.slug;

const getCategoryName = (category?: ICategoryResponse) =>
  category?.translations?.[0]?.name || category?.slug || "";

const flattenCategories = (
  categories: ICategoryResponse[],
  level = 0,
): Array<ICategoryResponse & { depth: number }> =>
  categories.flatMap((category) => [
    { ...category, depth: level },
    ...flattenCategories(category.children ?? [], level + 1),
  ]);

export const ProductGeneralInfo = ({
  product,
  brands = [],
  categoryTree = [],
  metadataLoading = false,
  metadataError,
  isEditing = false,
  editPrice = 0,
  setEditPrice,
  editStatus = 0,
  setEditStatus,
  editBrandId = "",
  setEditBrandId,
  editCategoryIds = [],
  setEditCategoryIds,
  editSkus = [],
  setEditSkus,
  deletedSkuIds = [],
  setDeletedSkuIds,
}: IProductGeneralInfoProps) => {
  const defaultName = getProductName(product.translations, product.slug);
  const flatCategories = flattenCategories(categoryTree);

  const toggleCategory = (categoryId: string) => {
    if (!setEditCategoryIds) return;
    setEditCategoryIds(
      editCategoryIds.includes(categoryId)
        ? editCategoryIds.filter((id) => id !== categoryId)
        : [...editCategoryIds, categoryId],
    );
  };

  return (
    <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[var(--app-text)]">
          General Information
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Basic info and metrics of the product.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        {/* Thumbnail */}
        <div className="bg-content/[0.02] flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] p-4">
          <div className="bg-content/[0.02] flex h-36 w-36 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-color)]">
            {product.thumbnail?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.thumbnail.url}
                alt={defaultName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-16 w-16 text-[var(--muted)]" />
            )}
          </div>
          <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
            Thumbnail Image
          </p>
        </div>

        {/* Core Info Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <Tag className="h-4 w-4" />
              Base Price
            </div>
            {isEditing ? (
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice?.(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2.5 py-1.5 text-sm font-semibold text-emerald-400 focus:border-indigo-500 focus:outline-none"
              />
            ) : (
              <p className="text-lg font-extrabold text-emerald-400">
                {formatCurrency(product.base_price)}
              </p>
            )}
          </div>

          <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <Activity className="h-4 w-4" />
              Status
            </div>
            {isEditing ? (
              <select
                value={editStatus}
                onChange={(e) => setEditStatus?.(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2.5 py-1.5 text-sm text-[var(--app-text)] focus:border-indigo-500 focus:outline-none"
              >
                <option value={0}>Draft</option>
                <option value={1}>Active</option>
                <option value={2}>Out of Stock</option>
              </select>
            ) : (
              <p className="text-sm font-semibold text-[var(--app-text)] capitalize">
                {product.status === 0
                  ? "Draft"
                  : product.status === 1
                    ? "Active"
                    : "Out of Stock"}
              </p>
            )}
          </div>

          <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <Award className="h-4 w-4" />
              Brand
            </div>
            {isEditing ? (
              <select
                value={editBrandId}
                onChange={(e) => setEditBrandId?.(e.target.value)}
                disabled={metadataLoading || brands.length === 0}
                className="mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2.5 py-1.5 text-sm text-[var(--app-text)] focus:border-indigo-500 focus:outline-none disabled:opacity-50"
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

          <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <Grid className="h-4 w-4" />
              Categories
            </div>
            {isEditing && (
              <p className="mt-1 text-xs font-semibold text-indigo-300">
                {editCategoryIds.length} selected
              </p>
            )}
            {isEditing ? (
              <div className="mt-2 max-h-44 space-y-1 overflow-y-auto pr-1">
                {metadataLoading ? (
                  <p className="text-sm text-[var(--muted)]">
                    Loading categories...
                  </p>
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
                        onChange={() => toggleCategory(category.id)}
                        className="h-4 w-4 accent-indigo-500"
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
                    const label = getCategoryName(c.category) || c.category_id;
                    return (
                      <span
                        key={c.category_id}
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
                      onClick={() => toggleCategory(categoryId)}
                      className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/15"
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

          <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4 sm:col-span-2">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <Star className="h-4 w-4" />
              Performance Metrics
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--app-text)]">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <b>{product.rating.toFixed(1)}</b>
              </span>
              <span>
                Sold: <b>{product.sold_count}</b>
              </span>
              <span>
                Reviews: <b>{product.review_count}</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Render Nested Product SKUs Table */}
      <ProductSkuTable
        product={product}
        isEditing={isEditing}
        editSkus={editSkus}
        setEditSkus={setEditSkus}
        deletedSkuIds={deletedSkuIds}
        setDeletedSkuIds={setDeletedSkuIds}
      />
    </section>
  );
};

ProductGeneralInfo.displayName = "ProductGeneralInfo";
