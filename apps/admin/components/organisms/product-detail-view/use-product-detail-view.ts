"use client";

import {
  type IBrandResponse,
  type ICategoryTreeResponse,
  type IProductResponse,
  type IUpdateProductSkuRequest,
  type IUpdateProductTranslationRequest,
} from "@ecommerce/shared";
import { toast, useLoadOnce } from "@ecommerce/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

import { adminBrandUseCase } from "@/domain/brand";
import { adminProductUseCase } from "@/domain/product";
import { adminProductCategoryUseCase } from "@/domain/product-category";

const collectCategoryIds = (categories: ICategoryTreeResponse): Set<string> => {
  const ids = new Set<string>();

  const visit = (items: ICategoryTreeResponse) => {
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

const getProductEditSnapshot = (product: IProductResponse) => ({
  base_price: Number(product.base_price),
  status: Number(product.status),
  brand_id: product.brand_id ?? "",
  category_ids: normalizeCategoryIds(
    product.categories?.map((category) => category.category_id) ?? [],
  ),
  translations:
    product.translations?.map((translation) => ({
      language_id: translation.language_id,
      name: translation.name,
      description: translation.description || "",
    })) ?? [],
  skus:
    product.skus?.map((sku) => ({
      id: sku.id,
      sku_code: sku.sku_code.trim(),
      price: Number(sku.price),
      stock: Number(sku.stock),
    })) ?? [],
  deleted_sku_ids: [] as string[],
});

export const useProductDetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [brands, setBrands] = useState<IBrandResponse[]>([]);
  const [categoryTree, setCategoryTree] = useState<ICategoryTreeResponse>([]);
  const [loading, setLoading] = useState(true);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<number>(0);
  const [editBrandId, setEditBrandId] = useState<string>("");
  const [editCategoryIds, setEditCategoryIds] = useState<string[]>([]);
  const [editTranslations, setEditTranslations] = useState<
    IUpdateProductTranslationRequest[]
  >([]);
  const [editSkus, setEditSkus] = useState<IUpdateProductSkuRequest[]>([]);
  const [deletedSkuIds, setDeletedSkuIds] = useState<string[]>([]);

  const isDirty = useMemo(() => {
    if (!product || !isEditing) return false;

    const currentSnapshot = getProductEditSnapshot(product);
    const editSnapshot = {
      base_price: Number(editPrice),
      status: Number(editStatus),
      brand_id: editBrandId,
      category_ids: normalizeCategoryIds(editCategoryIds),
      translations: editTranslations.map((translation) => ({
        language_id: translation.language_id,
        name: translation.name,
        description: translation.description || "",
      })),
      skus: editSkus.map((sku) => ({
        id: sku.id,
        sku_code: sku.sku_code.trim(),
        price: Number(sku.price),
        stock: Number(sku.stock),
      })),
      deleted_sku_ids: [...deletedSkuIds].sort((a, b) => a.localeCompare(b)),
    };

    return JSON.stringify(currentSnapshot) !== JSON.stringify(editSnapshot);
  }, [
    editBrandId,
    editCategoryIds,
    editPrice,
    editSkus,
    editStatus,
    editTranslations,
    deletedSkuIds,
    isEditing,
    product,
  ]);

  const canSave = isEditing && isDirty && !isPending && !metadataLoading;

  const loadProductDetail = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      setMetadataLoading(false);
      setError("Missing product slug.");
      return;
    }

    setLoading(true);
    setMetadataLoading(true);
    setError(null);
    setMetadataError(null);

    const [productResult, brandsResult, categoriesResult] =
      await Promise.allSettled([
        adminProductUseCase.getProduct.execute(slug),
        adminBrandUseCase.getBrands.execute({ page: 1, limit: 50 }),
        adminProductCategoryUseCase.getCategoryTree.execute(),
      ]);

    if (productResult.status === "fulfilled") {
      const response = productResult.value;
      if (response.status === "success" && response.data) {
        setProduct(response.data);
      } else {
        setError(response.message || "Failed to load product detail.");
      }
    } else {
      console.error(productResult.reason);
      setError("Failed to load product detail.");
    }

    if (brandsResult.status === "fulfilled") {
      setBrands(brandsResult.value.data?.items ?? []);
    } else {
      console.error(brandsResult.reason);
      setMetadataError("Failed to load brand options.");
    }

    if (categoriesResult.status === "fulfilled") {
      setCategoryTree(categoriesResult.value.data ?? []);
    } else {
      console.error(categoriesResult.reason);
      setMetadataError((current) =>
        current
          ? `${current} Failed to load category options.`
          : "Failed to load category options.",
      );
    }

    setLoading(false);
    setMetadataLoading(false);
  }, [slug]);

  useLoadOnce(loadProductDetail, !!slug);

  const startEdit = () => {
    if (!product) return;
    const snapshot = getProductEditSnapshot(product);
    setEditPrice(snapshot.base_price);
    setEditStatus(snapshot.status);
    setEditBrandId(snapshot.brand_id);
    setEditCategoryIds(snapshot.category_ids);
    setEditTranslations(snapshot.translations);
    setEditSkus(snapshot.skus);
    setDeletedSkuIds(snapshot.deleted_sku_ids);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (isDirty && !window.confirm("Discard unsaved product changes?")) {
      return;
    }

    setIsEditing(false);
  };

  const saveProduct = () => {
    if (!product) return;
    if (!canSave) return;

    startTransition(async () => {
      try {
        const normalizedSkus = editSkus.map((sku) => ({
          ...sku,
          sku_code: sku.sku_code.trim(),
          price: Number(sku.price),
          stock: Number(sku.stock),
        }));
        const skuCodes = normalizedSkus.map((sku) => sku.sku_code);

        if (Number(editPrice) < 0) {
          toast.error("Base price must be zero or greater.");
          return;
        }

        if (editCategoryIds.length === 0) {
          toast.error("Select at least one category.");
          return;
        }

        if (normalizedSkus.length === 0) {
          toast.error("Product must have at least one SKU.");
          return;
        }

        const availableCategoryIds = collectCategoryIds(categoryTree);
        if (
          availableCategoryIds.size > 0 &&
          editCategoryIds.some((id) => !availableCategoryIds.has(id))
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
              sku.price < 0 || sku.stock < 0 || !Number.isInteger(sku.stock),
          )
        ) {
          toast.error("SKU price and stock must be valid non-negative values.");
          return;
        }

        const payload = {
          base_price: Number(editPrice),
          status: Number(editStatus),
          brand_id: editBrandId || null,
          category_ids: editCategoryIds,
          translations: editTranslations,
          skus: normalizedSkus,
          deleted_sku_ids: deletedSkuIds,
        };

        const response = await adminProductUseCase.updateProduct.execute(
          product.id,
          payload,
        );
        if (response.status === "success" && response.data) {
          setProduct(response.data);
          setIsEditing(false);
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
    product,
    brands,
    categoryTree,
    loading,
    metadataLoading,
    error,
    metadataError,
    router,
    isEditing,
    isDirty,
    isSaving: isPending,
    canSave,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    editBrandId,
    setEditBrandId,
    editCategoryIds,
    setEditCategoryIds,
    editTranslations,
    setEditTranslations,
    editSkus,
    setEditSkus,
    deletedSkuIds,
    setDeletedSkuIds,
    startEdit,
    cancelEdit,
    saveProduct,
  };
};
