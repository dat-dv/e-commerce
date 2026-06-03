import { useCallback, useMemo, useState } from "react";

import type { IAdminProduct } from "@/domain/product";

export interface IProductEditFormState {
  basePrice: number;
  status: number;
  thumbnailId: string;
  thumbnailUrl: string;
  brandId: string;
  categoryIds: string[];
  translations: {
    languageId: string;
    name: string;
    description: string;
  }[];
  skus: {
    id?: string;
    skuCode: string;
    price: number;
    originalPrice: number | null;
    stock: number;
    imageUrl: string;
    unitPrice: string;
    attributeValueIds: string[];
  }[];
  deletedSkuIds: string[];
}

const normalizeCategoryIds = (categoryIds: string[]) =>
  [...categoryIds].sort((a, b) => a.localeCompare(b));

export const getProductEditSnapshot = (
  product: IAdminProduct,
): IProductEditFormState => ({
  basePrice: Number(product.basePrice),
  status: Number(product.status),
  thumbnailId: product.thumbnailId ?? "",
  thumbnailUrl: product.thumbnail?.url ?? "",
  brandId: product.brandId ?? "",
  categoryIds: normalizeCategoryIds(
    product.categories?.map((category) => category.categoryId) ?? [],
  ),
  translations:
    product.translations?.map((translation) => ({
      languageId: translation.languageId,
      name: translation.name,
      description: translation.description || "",
    })) ?? [],
  skus:
    product.skus?.map((sku) => ({
      id: sku.id,
      skuCode: sku.skuCode.trim(),
      price: Number(sku.price),
      originalPrice:
        sku.originalPrice === null || sku.originalPrice === undefined
          ? null
          : Number(sku.originalPrice),
      stock: Number(sku.stock),
      imageUrl: sku.imageUrl || "",
      unitPrice: sku.unitPrice || "VND",
      attributeValueIds:
        sku.skuAttributeValues?.map((item) => item.attributeValueId) ?? [],
    })) ?? [],
  deletedSkuIds: [],
});

export const useProductEditState = (product: IAdminProduct | null) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<IProductEditFormState | null>(
    null,
  );

  const updateFormState = useCallback(
    <K extends keyof IProductEditFormState>(
      key: K,
      value: IProductEditFormState[K],
    ) => {
      setFormState((prev) => (prev ? { ...prev, [key]: value } : null));
    },
    [],
  );

  const isDirty = useMemo(() => {
    if (!product || !isEditing || !formState) return false;

    const currentSnapshot = getProductEditSnapshot(product);
    const editSnapshot = {
      ...formState,
      categoryIds: normalizeCategoryIds(formState.categoryIds),
      deletedSkuIds: [...formState.deletedSkuIds].sort((a, b) =>
        a.localeCompare(b),
      ),
    };

    return JSON.stringify(currentSnapshot) !== JSON.stringify(editSnapshot);
  }, [formState, isEditing, product]);

  const startEdit = useCallback(() => {
    if (!product) return;
    setFormState(getProductEditSnapshot(product));
    setIsEditing(true);
  }, [product]);

  const cancelEdit = useCallback(() => {
    if (isDirty && !window.confirm("Discard unsaved product changes?")) {
      return;
    }
    setFormState(null);
    setIsEditing(false);
  }, [isDirty]);

  return {
    isEditing,
    setIsEditing,
    formState,
    setFormState,
    updateFormState,
    isDirty,
    startEdit,
    cancelEdit,
  };
};
