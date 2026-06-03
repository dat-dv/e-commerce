import {
  type IAttributeListResponse,
  type IBrandResponse,
  type ICategoryResponse,
  type ICategoryTreeResponse,
  type IProductResponse,
} from "@ecommerce/shared";

import {
  ProductBasePriceField,
  ProductBrandField,
  ProductCategoriesField,
  ProductMetricsField,
  ProductStatusField,
  ProductThumbnailField,
} from "@/components/molecules/product-fields";
import { ProductSkuTable } from "@/components/organisms/product-detail-view/product-sku-table";
import type { IProductFormState } from "@/hooks/product/use-product-detail-form";

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
  const defaultName = product.translations?.[0]?.name ?? "";
  const flatCategories = flattenCategories(categoryTree);
  const thumbnailUrl =
    isEditing && formState
      ? formState.thumbnail_url || product.thumbnail?.url
      : product.thumbnail?.url;

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
        <ProductThumbnailField
          thumbnailUrl={thumbnailUrl}
          defaultName={defaultName}
          isEditing={isEditing}
          isUploadingThumbnail={isUploadingThumbnail}
          onThumbnailUpload={onThumbnailUpload}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ProductBasePriceField
            basePrice={Number(product.base_price)}
            editPrice={formState?.base_price ?? 0}
            isEditing={isEditing}
            onPriceChange={(price) => updateFormState?.("base_price", price)}
          />

          <ProductStatusField
            status={product.status}
            editStatus={formState?.status ?? 0}
            isEditing={isEditing}
            onStatusChange={(status) => updateFormState?.("status", status)}
          />

          <ProductBrandField
            product={product}
            brands={brands}
            editBrandId={formState?.brand_id ?? ""}
            isEditing={isEditing}
            metadataLoading={metadataLoading}
            onBrandChange={(brandId) => updateFormState?.("brand_id", brandId)}
          />

          <ProductCategoriesField
            product={product}
            flatCategories={flatCategories}
            editCategoryIds={formState?.category_ids ?? []}
            isEditing={isEditing}
            metadataLoading={metadataLoading}
            metadataError={metadataError}
            onToggleCategory={(categoryId) => {
              if (!updateFormState || !formState) return;
              updateFormState(
                "category_ids",
                formState.category_ids.includes(categoryId)
                  ? formState.category_ids.filter((id) => id !== categoryId)
                  : [...formState.category_ids, categoryId],
              );
            }}
          />

          <ProductMetricsField product={product} />
        </div>
      </div>

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
