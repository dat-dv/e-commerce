"use client";

import { toast } from "@ecommerce/ui";
import { useCallback, useTransition } from "react";

import {
  adminProductUseCase,
  type IAdminCategory,
  type IAdminProduct,
  type IAdminUpdateProductRequest,
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

const buildProductUpdatePayload = (
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

interface IUseProductSaveActionParams {
  product: IAdminProduct | null;
  formState: IProductEditFormState | null;
  categoryTree: IAdminCategory[];
  canSubmit: boolean;
  onSaved: (product: IAdminProduct) => void;
}

export const useProductSaveAction = ({
  product,
  formState,
  categoryTree,
  canSubmit,
  onSaved,
}: IUseProductSaveActionParams) => {
  const [isSaving, startTransition] = useTransition();

  const saveProduct = useCallback(() => {
    if (!product || !formState || !canSubmit || isSaving) return;

    startTransition(async () => {
      try {
        const payload = buildProductUpdatePayload(formState);
        const normalizedSkus = payload.skus ?? [];
        const normalizedTranslations = payload.translations ?? [];
        const skuCodes = normalizedSkus.map((sku) => sku.sku_code);

        if (Number(formState.basePrice) < 0) {
          toast.error("Base price must be zero or greater.");
          return;
        }

        if (formState.categoryIds.length === 0) {
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
          formState.categoryIds.some((id) => !availableCategoryIds.has(id))
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
              (sku.original_price !== null &&
                sku.original_price !== undefined &&
                sku.original_price < 0) ||
              sku.stock < 0 ||
              !Number.isInteger(sku.stock),
          )
        ) {
          toast.error(
            "SKU price, original price, and stock must be valid non-negative values.",
          );
          return;
        }

        const response = await adminProductUseCase.updateProduct.execute(
          product.id,
          payload,
        );
        onSaved(response);
        toast.success("Product updated successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to save product details.");
      }
    });
  }, [canSubmit, categoryTree, formState, isSaving, onSaved, product]);

  return {
    isSaving,
    saveProduct,
  };
};
