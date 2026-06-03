"use client";

import type {
  IUpdateProductSkuRequest,
  IUpdateProductTranslationRequest,
} from "@ecommerce/shared";
import { toast } from "@ecommerce/ui";
import { useCallback, useMemo, useState, useTransition } from "react";

import {
  adminProductUseCase,
  type IAdminCategory,
  type IAdminProduct,
} from "@/domain/product";
import { adminUploadUseCase } from "@/domain/upload";

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
  const [isPending, startTransition] = useTransition();
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const [formState, setFormState] = useState<IProductFormState | null>(null);

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

  const canSave =
    isEditing &&
    isDirty &&
    !isPending &&
    !metadataLoading &&
    !isUploadingThumbnail;

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

  const uploadThumbnail = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Select a valid image file.");
      return;
    }

    setIsUploadingThumbnail(true);
    try {
      const response = await adminUploadUseCase.uploadImage.execute(file);
      if (response.status === "success" && response.data) {
        setFormState((prev) =>
          prev
            ? {
                ...prev,
                thumbnail_id: response.data!.id,
                thumbnail_url: response.data!.url,
              }
            : null,
        );
        toast.success("Thumbnail uploaded. Save product to apply it.");
      } else {
        toast.error(response.message || "Failed to upload thumbnail.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload thumbnail.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  }, []);

  const saveProduct = () => {
    if (!product || !formState || !canSave) return;

    startTransition(async () => {
      try {
        const normalizedSkus = formState.skus.map((sku) => ({
          ...sku,
          sku_code: sku.sku_code.trim(),
          price: Number(sku.price),
          original_price:
            sku.original_price === null || sku.original_price === undefined
              ? null
              : Number(sku.original_price),
          stock: Number(sku.stock),
          image_url: sku.image_url?.trim() || null,
          unit_price: sku.unit_price?.trim() || "VND",
          attribute_value_ids: sku.attribute_value_ids ?? [],
        }));
        const normalizedTranslations = formState.translations.map(
          (translation) => ({
            ...translation,
            name: translation.name.trim(),
            description: translation.description?.trim() || "",
          }),
        );
        const skuCodes = normalizedSkus.map((sku) => sku.sku_code);

        if (Number(formState.base_price) < 0) {
          toast.error("Base price must be zero or greater.");
          return;
        }

        if (formState.category_ids.length === 0) {
          toast.error("Select at least one category.");
          return;
        }

        if (normalizedSkus.length === 0) {
          toast.error("Product must have at least one SKU.");
          return;
        }

        if (normalizedTranslations.some((translation) => !translation.name)) {
          toast.error("Translation name is required.");
          return;
        }

        const availableCategoryIds = collectCategoryIds(categoryTree);
        if (
          availableCategoryIds.size > 0 &&
          formState.category_ids.some((id) => !availableCategoryIds.has(id))
        ) {
          toast.error("Selected categories are no longer available.");
          return;
        }

        if (normalizedSkus.some((sku) => !sku.sku_code)) {
          toast.error("SKU code is required.");
          return;
        }

        if (new Set(skuCodes).size !== skuCodes.length) {
          toast.error("SKU codes must be unique.");
          return;
        }

        if (
          normalizedSkus.some(
            (sku) =>
              sku.price < 0 ||
              (sku.original_price !== null && sku.original_price < 0) ||
              sku.stock < 0 ||
              !Number.isInteger(sku.stock),
          )
        ) {
          toast.error(
            "SKU price, original price, and stock must be valid non-negative values.",
          );
          return;
        }

        const payload = {
          base_price: Number(formState.base_price),
          status: Number(formState.status),
          thumbnail_id: formState.thumbnail_id || null,
          brand_id: formState.brand_id || null,
          category_ids: formState.category_ids,
          translations: normalizedTranslations,
          skus: normalizedSkus,
          deleted_sku_ids: formState.deleted_sku_ids,
        };

        const response = await adminProductUseCase.updateProduct.execute(
          product.id,
          payload,
        );
        if (response.status === "success" && response.data) {
          setProduct(response.data);
          setIsEditing(false);
          setFormState(null);
          toast.success("Product updated successfully!");
        } else {
          toast.error(response.message || "Failed to save product.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to save product details.");
      }
    });
  };

  return {
    formState,
    updateFormState,
    isEditing,
    isDirty,
    isSaving: isPending,
    isUploadingThumbnail,
    canSave,
    startEdit,
    cancelEdit,
    uploadThumbnail,
    saveProduct,
  };
};
