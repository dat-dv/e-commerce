import {
  ProductBasePriceField,
  ProductBrandField,
  ProductCategoriesField,
  ProductMetricsField,
  ProductStatusField,
  ProductThumbnailField,
} from "@/components/molecules/product-fields";
import { ProductSkuTable } from "@/components/organisms/product-detail-view/product-sku-table";
import type {
  IAdminAttribute,
  IAdminBrand,
  IAdminCategory,
  IAdminProduct,
} from "@/domain/product";
import type { IProductEditFormState } from "@/hooks/product/use-product-detail-form";

interface IProductGeneralInfoProps {
  product: IAdminProduct;
  brands?: IAdminBrand[];
  attributes?: IAdminAttribute[];
  categoryTree?: IAdminCategory[];
  metadataLoading?: boolean;
  metadataError?: string | null;
  isEditing?: boolean;
  formState?: IProductEditFormState | null;
  updateFormState?: <K extends keyof IProductEditFormState>(
    key: K,
    value: IProductEditFormState[K],
  ) => void;
  isUploadingThumbnail?: boolean;
  onThumbnailUpload?: (file: File) => void;
}

const flattenCategories = (
  categories: IAdminCategory[],
  level = 0,
): Array<IAdminCategory & { depth: number }> =>
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
      ? formState.thumbnailUrl || product.thumbnail?.url
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
            basePrice={Number(product.basePrice)}
            editPrice={formState?.basePrice ?? 0}
            isEditing={isEditing}
            onPriceChange={(price) => updateFormState?.("basePrice", price)}
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
            editBrandId={formState?.brandId ?? ""}
            isEditing={isEditing}
            metadataLoading={metadataLoading}
            onBrandChange={(brandId) => updateFormState?.("brandId", brandId)}
          />

          <ProductCategoriesField
            product={product}
            flatCategories={flatCategories}
            editCategoryIds={formState?.categoryIds ?? []}
            isEditing={isEditing}
            metadataLoading={metadataLoading}
            metadataError={metadataError}
            onToggleCategory={(categoryId) => {
              if (!updateFormState || !formState) return;
              updateFormState(
                "categoryIds",
                formState.categoryIds.includes(categoryId)
                  ? formState.categoryIds.filter((id) => id !== categoryId)
                  : [...formState.categoryIds, categoryId],
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
