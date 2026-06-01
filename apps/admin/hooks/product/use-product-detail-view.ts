"use client";

import {
  type IAttributeListResponse,
  type IBrandResponse,
  type ICategoryTreeResponse,
  type ILanguageListResponse,
  type IProductResponse,
  type IUpdateProductSkuRequest,
  type IUpdateProductTranslationRequest,
} from "@ecommerce/shared";
import { toast, useLoadOnce } from "@ecommerce/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

import { adminAttributeUseCase } from "@/domain/attribute";
import { adminBrandUseCase } from "@/domain/brand";
import { adminLanguageUseCase } from "@/domain/language";
import { adminProductUseCase } from "@/domain/product";
import { adminProductCategoryUseCase } from "@/domain/product-category";
import { adminUploadUseCase } from "@/domain/upload";

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
  thumbnail_id: product.thumbnail_id ?? "",
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
      original_price:
        sku.original_price === null || sku.original_price === undefined
          ? null
          : Number(sku.original_price),
      stock: Number(sku.stock),
      image_url: sku.image_url || "",
      unit_price: sku.unit_price || "VND",
      attribute_value_ids:
        sku.sku_attribute_values?.map((item) => item.attribute_value_id) ?? [],
    })) ?? [],
  deleted_sku_ids: [] as string[],
});

export const useProductDetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [brands, setBrands] = useState<IBrandResponse[]>([]);
  const [attributes, setAttributes] = useState<IAttributeListResponse>([]);
  const [languages, setLanguages] = useState<ILanguageListResponse>([]);
  const [categoryTree, setCategoryTree] = useState<ICategoryTreeResponse>([]);
  const [loading, setLoading] = useState(true);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<number>(0);
  const [editThumbnailId, setEditThumbnailId] = useState<string>("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState<string>("");
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
      thumbnail_id: editThumbnailId,
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
        original_price:
          sku.original_price === null || sku.original_price === undefined
            ? null
            : Number(sku.original_price),
        stock: Number(sku.stock),
        image_url: sku.image_url || "",
        unit_price: sku.unit_price || "VND",
        attribute_value_ids: sku.attribute_value_ids ?? [],
      })),
      deleted_sku_ids: [...deletedSkuIds].sort((a, b) => a.localeCompare(b)),
    };

    return JSON.stringify(currentSnapshot) !== JSON.stringify(editSnapshot);
  }, [
    editBrandId,
    editCategoryIds,
    editPrice,
    editThumbnailId,
    editSkus,
    editStatus,
    editTranslations,
    deletedSkuIds,
    isEditing,
    product,
  ]);

  const canSave =
    isEditing &&
    isDirty &&
    !isPending &&
    !metadataLoading &&
    !isUploadingThumbnail;

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

    const [
      productResult,
      brandsResult,
      categoriesResult,
      attributesResult,
      languagesResult,
    ] = await Promise.allSettled([
      adminProductUseCase.getProduct.execute(slug),
      adminBrandUseCase.getBrands.execute({ page: 1, limit: 50 }),
      adminProductCategoryUseCase.getCategoryTree.execute(),
      adminAttributeUseCase.getAttributes.execute(),
      adminLanguageUseCase.getLanguages.execute(),
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

    if (attributesResult.status === "fulfilled") {
      setAttributes(attributesResult.value.data ?? []);
    } else {
      console.error(attributesResult.reason);
      setMetadataError((current) =>
        current
          ? `${current} Failed to load attribute options.`
          : "Failed to load attribute options.",
      );
    }

    if (languagesResult.status === "fulfilled") {
      setLanguages(languagesResult.value.data ?? []);
    } else {
      console.error(languagesResult.reason);
      setMetadataError((current) =>
        current
          ? `${current} Failed to load language options.`
          : "Failed to load language options.",
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
    setEditThumbnailId(snapshot.thumbnail_id);
    setEditThumbnailUrl(product.thumbnail?.url ?? "");
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

  const uploadThumbnail = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Select a valid image file.");
      return;
    }

    setIsUploadingThumbnail(true);
    try {
      const response = await adminUploadUseCase.uploadImage.execute(file);
      if (response.status === "success" && response.data) {
        setEditThumbnailId(response.data.id);
        setEditThumbnailUrl(response.data.url);
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
    if (!product) return;
    if (!canSave) return;

    startTransition(async () => {
      try {
        const normalizedSkus = editSkus.map((sku) => ({
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
        const normalizedTranslations = editTranslations.map((translation) => ({
          ...translation,
          name: translation.name.trim(),
          description: translation.description?.trim() || "",
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

        if (normalizedTranslations.some((translation) => !translation.name)) {
          toast.error("Translation name is required.");
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
          base_price: Number(editPrice),
          status: Number(editStatus),
          thumbnail_id: editThumbnailId || null,
          brand_id: editBrandId || null,
          category_ids: editCategoryIds,
          translations: normalizedTranslations,
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
    attributes,
    languages,
    categoryTree,
    loading,
    metadataLoading,
    error,
    metadataError,
    router,
    isEditing,
    isDirty,
    isSaving: isPending,
    isUploadingThumbnail,
    canSave,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    editThumbnailId,
    setEditThumbnailId,
    editThumbnailUrl,
    setEditThumbnailUrl,
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
    uploadThumbnail,
    saveProduct,
  };
};
