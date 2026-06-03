import type {
  IAdminCategory,
  IAdminUpdateProductRequest,
} from "@/domain/product";

import type { IProductEditFormState } from "./use-product-edit-state";

const collectCategoryIds = (categories: IAdminCategory[]): Set<string> => {
  const ids = new Set<string>();
  const visit = (items: IAdminCategory[]) => {
    for (const item of items) {
      ids.add(item.id);
      visit(item.children ?? []);
    }
  };
  visit(categories);
  return ids;
};

export const buildProductUpdatePayload = (
  formState: IProductEditFormState,
): IAdminUpdateProductRequest => ({
  base_price: Number(formState.basePrice),
  status: Number(formState.status),
  thumbnail_id: formState.thumbnailId || null,
  brand_id: formState.brandId || null,
  category_ids: formState.categoryIds,
  translations: formState.translations.map((translation) => ({
    language_id: translation.languageId,
    name: translation.name.trim(),
    description: translation.description?.trim() || "",
  })),
  skus: formState.skus.map((sku) => ({
    id: sku.id,
    sku_code: sku.skuCode.trim(),
    price: Number(sku.price),
    original_price:
      sku.originalPrice === null || sku.originalPrice === undefined
        ? null
        : Number(sku.originalPrice),
    stock: Number(sku.stock),
    image_url: sku.imageUrl?.trim() || null,
    unit_price: sku.unitPrice?.trim() || "VND",
    attribute_value_ids: sku.attributeValueIds ?? [],
  })),
  deleted_sku_ids: formState.deletedSkuIds,
});

export const getProductUpdateValidationError = (
  payload: IAdminUpdateProductRequest,
  formState: IProductEditFormState,
  categoryTree: IAdminCategory[],
): string | null => {
  const normalizedSkus = payload.skus ?? [];
  const normalizedTranslations = payload.translations ?? [];
  const skuCodes = normalizedSkus.map((sku) => sku.sku_code);

  if (Number(formState.basePrice) < 0) {
    return "Base price must be zero or greater.";
  }

  if (formState.categoryIds.length === 0) {
    return "Select at least one category.";
  }

  if (normalizedSkus.length === 0) {
    return "Product must have at least one SKU.";
  }

  if (normalizedTranslations.some((translation) => !translation.name)) {
    return "Translation name is required.";
  }

  const availableCategoryIds = collectCategoryIds(categoryTree);
  if (
    availableCategoryIds.size > 0 &&
    formState.categoryIds.some((id) => !availableCategoryIds.has(id))
  ) {
    return "Selected categories are no longer available.";
  }

  if (normalizedSkus.some((sku) => !sku.sku_code)) {
    return "SKU code is required.";
  }

  if (new Set(skuCodes).size !== skuCodes.length) {
    return "SKU codes must be unique.";
  }

  if (
    normalizedSkus.some(
      (sku) =>
        sku.price < 0 ||
        (sku.original_price !== null &&
          sku.original_price !== undefined &&
          sku.original_price < 0) ||
        sku.stock < 0 ||
        !Number.isInteger(sku.stock),
    )
  ) {
    return "SKU price, original price, and stock must be valid non-negative values.";
  }

  return null;
};
