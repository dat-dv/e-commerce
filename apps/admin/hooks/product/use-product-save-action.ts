"use client";

import { toast } from "@ecommerce/ui";
import { useCallback, useTransition } from "react";

import {
  adminProductUseCase,
  type IAdminCategory,
  type IAdminProduct,
} from "@/domain/product";

import {
  buildProductUpdatePayload,
  getProductUpdateValidationError,
} from "./product-save.utils";
import type { IProductEditFormState } from "./use-product-edit-state";

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
        const validationError = getProductUpdateValidationError(
          payload,
          formState,
          categoryTree,
        );

        if (validationError) {
          toast.error(validationError);
          return;
        }

        const response = await adminProductUseCase.updateProduct.execute(
          product.id,
          payload,
        );
        onSaved(response);
        toast.success("Product updated successfully!");
      } catch {
        toast.error("Failed to save product details.");
      }
    });
  }, [canSubmit, categoryTree, formState, isSaving, onSaved, product]);

  return {
    isSaving,
    saveProduct,
  };
};
