"use client";

import type {
  IUpdateProductSkuRequest,
  IUpdateProductTranslationRequest,
} from "@ecommerce/shared";
import { useCallback, useMemo, useState } from "react";

import { type IAdminCategory, type IAdminProduct } from "@/domain/product";

import { useProductSaveAction } from "./use-product-save-action";
import { useProductThumbnailUpload } from "./use-product-thumbnail-upload";

const normalizeCategoryIds = (categoryIds: string[]) =>
  [...categoryIds].sort((a, b) => a.localeCompare(b));

export interface IProductFormState {
  base_price: number;
  status: number;
  thumbnail_id: string;
  thumbnail_url: string;
  brand_id: string;
  category_ids: string[];
  translations: IUpdateProductTranslationRequest[];
  skus: IUpdateProductSkuRequest[];
  deleted_sku_ids: string[];
}

export const getProductEditSnapshot = (
  product: IAdminProduct,
): IProductFormState => ({
  base_price: Number(product.basePrice),
  status: Number(product.status),
  thumbnail_id: product.thumbnailId ?? "",
  thumbnail_url: product.thumbnail?.url ?? "",
  brand_id: product.brandId ?? "",
  category_ids: normalizeCategoryIds(
    product.categories?.map((category) => category.categoryId) ?? [],
  ),
  translations:
    product.translations?.map((translation) => ({
      language_id: translation.languageId,
      name: translation.name,
      description: translation.description || "",
    })) ?? [],
  skus:
    product.skus?.map((sku) => ({
      id: sku.id,
      sku_code: sku.skuCode.trim(),
      price: Number(sku.price),
      original_price:
        sku.originalPrice === null || sku.originalPrice === undefined
          ? null
          : Number(sku.originalPrice),
      stock: Number(sku.stock),
      image_url: sku.imageUrl || "",
      unit_price: sku.unitPrice || "VND",
      attribute_value_ids:
        sku.skuAttributeValues?.map((item) => item.attributeValueId) ?? [],
    })) ?? [],
  deleted_sku_ids: [],
});

export const useProductDetailForm = (
  product: IAdminProduct | null,
  setProduct: (product: IAdminProduct) => void,
  categoryTree: IAdminCategory[],
  metadataLoading: boolean,
) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState<IProductFormState | null>(null);

  const handleThumbnailUploaded = useCallback(
    (thumbnail: { id: string; url: string }) => {
      setFormState((prev) =>
        prev
          ? {
              ...prev,
              thumbnail_id: thumbnail.id,
              thumbnail_url: thumbnail.url,
            }
          : null,
      );
    },
    [],
  );

  const { isUploadingThumbnail, uploadThumbnail } = useProductThumbnailUpload({
    onUploaded: handleThumbnailUploaded,
  });

  const updateFormState = useCallback(
    <K extends keyof IProductFormState>(
      key: K,
      value: IProductFormState[K],
    ) => {
      setFormState((prev) => (prev ? { ...prev, [key]: value } : null));
    },
    [],
  );

  const isDirty = useMemo(() => {
    if (!product || !isEditing || !formState) return false;

    const currentSnapshot = getProductEditSnapshot(product);
    // Sort array fields for comparison
    const editSnapshot = {
      ...formState,
      category_ids: normalizeCategoryIds(formState.category_ids),
      deleted_sku_ids: [...formState.deleted_sku_ids].sort((a, b) =>
        a.localeCompare(b),
      ),
    };

    return JSON.stringify(currentSnapshot) !== JSON.stringify(editSnapshot);
  }, [formState, isEditing, product]);

  const canSubmit =
    isEditing && isDirty && !metadataLoading && !isUploadingThumbnail;

  const handleProductSaved = useCallback(
    (nextProduct: IAdminProduct) => {
      setProduct(nextProduct);
      setIsEditing(false);
      setFormState(null);
    },
    [setProduct],
  );

  const { isSaving, saveProduct } = useProductSaveAction({
    product,
    formState,
    categoryTree,
    canSubmit,
    onSaved: handleProductSaved,
  });

  const canSave = canSubmit && !isSaving;

  const startEdit = () => {
    if (!product) return;
    setFormState(getProductEditSnapshot(product));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (isDirty && !window.confirm("Discard unsaved product changes?")) {
      return;
    }
    setFormState(null);
    setIsEditing(false);
  };

  return {
    formState,
    updateFormState,
    isEditing,
    isDirty,
    isSaving,
    isUploadingThumbnail,
    canSave,
    startEdit,
    cancelEdit,
    uploadThumbnail,
    saveProduct,
  };
};
