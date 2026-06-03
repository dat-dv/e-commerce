"use client";

import { useCallback } from "react";

import { type IAdminCategory, type IAdminProduct } from "@/domain/product";

import { useProductEditState } from "./use-product-edit-state";
import { useProductSaveAction } from "./use-product-save-action";
import { useProductThumbnailUpload } from "./use-product-thumbnail-upload";

export type { IProductEditFormState } from "./use-product-edit-state";
export { getProductEditSnapshot } from "./use-product-edit-state";

export const useProductDetailForm = (
  product: IAdminProduct | null,
  setProduct: (product: IAdminProduct) => void,
  categoryTree: IAdminCategory[],
  metadataLoading: boolean,
) => {
  const {
    isEditing,
    setIsEditing,
    formState,
    setFormState,
    updateFormState,
    isDirty,
    startEdit,
    cancelEdit,
  } = useProductEditState(product);

  const handleThumbnailUploaded = useCallback(
    (thumbnail: { id: string; url: string }) => {
      setFormState((prev) =>
        prev
          ? {
              ...prev,
              thumbnailId: thumbnail.id,
              thumbnailUrl: thumbnail.url,
            }
          : null,
      );
    },
    [setFormState],
  );

  const { isUploadingThumbnail, uploadThumbnail } = useProductThumbnailUpload({
    onUploaded: handleThumbnailUploaded,
  });

  const canSubmit =
    isEditing && isDirty && !metadataLoading && !isUploadingThumbnail;

  const handleProductSaved = useCallback(
    (nextProduct: IAdminProduct) => {
      setProduct(nextProduct);
      setIsEditing(false);
      setFormState(null);
    },
    [setProduct, setIsEditing, setFormState],
  );

  const { isSaving, saveProduct } = useProductSaveAction({
    product,
    formState,
    categoryTree,
    canSubmit,
    onSaved: handleProductSaved,
  });

  const canSave = canSubmit && !isSaving;

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
