import {
  type IAttributeListResponse,
  type IBrandResponse,
  type ICategoryResponse,
  type ICategoryTreeResponse,
  type IProductResponse,
} from "@ecommerce/shared";
import {
  Activity,
  Award,
  Grid,
  ImageUp,
  Package,
  Star,
  Tag,
  X,
} from "lucide-react";
import type { ChangeEvent } from "react";

import type { IProductFormState } from "@/hooks/product/use-product-detail-form";

import { formatCurrency, getProductName } from "../products-view/product.utils";
import { ProductSkuTable } from "./product-sku-table";

interface IProductGeneralInfoProps {
  product: IProductResponse;
  brands?: IBrandResponse[];
  attributes?: IAttributeListResponse;
  categoryTree?: ICategoryTreeResponse;
  metadataLoading?: boolean;
  metadataError?: string | null;
  isEditing?: boolean;
  formState?: IProductFormState | null;
  updateFormState?: <K extends keyof IProductFormState>(
    key: K,
    value: IProductFormState[K],
  ) => void;
  isUploadingThumbnail?: boolean;
  onThumbnailUpload?: (file: File) => void;
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
  attributes = [],
  categoryTree = [],
  metadataLoading = false,
  metadataError,
  isEditing = false,
  formState,
  updateFormState,
  isUploadingThumbnail = false,
  onThumbnailUpload,
}: IProductGeneralInfoProps) => {
  const defaultName = getProductName(product.translations, product.slug);
  const flatCategories = flattenCategories(categoryTree);
  const thumbnailUrl =
    isEditing && formState
      ? formState.thumbnail_url || product.thumbnail?.url
      : product.thumbnail?.url;

  const toggleCategory = (categoryId: string) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "category_ids",
      formState.category_ids.includes(categoryId)
        ? formState.category_ids.filter((id) => id !== categoryId)
        : [...formState.category_ids, categoryId],
    );
  };

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onThumbnailUpload?.(file);
    }
    event.target.value = "";
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
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
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
          {isEditing && (
            <label className="hover:border-primary mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-xs font-semibold text-[var(--app-text)] transition-colors disabled:cursor-not-allowed disabled:opacity-60">
              <ImageUp className="h-4 w-4" />
              {isUploadingThumbnail ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={isUploadingThumbnail}
                onChange={handleThumbnailChange}
              />
            </label>
          )}
        </div>

        {/* Core Info Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <Tag className="h-4 w-4" />
              Base Price
            </div>
            {isEditing && formState ? (
              <input
                type="number"
                value={formState.base_price}
                onChange={(e) =>
                  updateFormState?.("base_price", Number(e.target.value))
                }
                className="focus:border-primary mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2.5 py-1.5 text-sm font-semibold text-emerald-400 focus:outline-none"
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
            {isEditing && formState ? (
              <select
                value={formState.status}
                onChange={(e) =>
                  updateFormState?.("status", Number(e.target.value))
                }
                className="focus:border-primary mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2.5 py-1.5 text-sm text-[var(--app-text)] focus:outline-none"
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
            {isEditing && formState ? (
              <select
                value={formState.brand_id}
                onChange={(e) => updateFormState?.("brand_id", e.target.value)}
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

          <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <Grid className="h-4 w-4" />
              Categories
            </div>
            {isEditing && formState && (
              <p className="text-primary mt-1 text-xs font-semibold">
                {formState.category_ids.length} selected
              </p>
            )}
            {isEditing && formState ? (
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
                        checked={formState.category_ids.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
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
            {isEditing && formState && formState.category_ids.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formState.category_ids.map((categoryId) => {
                  const category = flatCategories.find(
                    (item) => item.id === categoryId,
                  );
                  return (
                    <button
                      key={categoryId}
                      type="button"
                      onClick={() => toggleCategory(categoryId)}
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
        attributes={attributes}
        isEditing={isEditing}
        formState={formState}
        updateFormState={updateFormState}
      />
    </section>
  );
};

ProductGeneralInfo.displayName = "ProductGeneralInfo";
