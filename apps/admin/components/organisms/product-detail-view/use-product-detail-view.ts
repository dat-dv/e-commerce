"use client";

import {
  type IProductResponse,
  type IUpdateProductSkuRequest,
  type IUpdateProductTranslationRequest,
} from "@ecommerce/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { adminProductUseCase } from "@/domain/product";

export const useProductDetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<number>(0);
  const [editTranslations, setEditTranslations] = useState<
    IUpdateProductTranslationRequest[]
  >([]);
  const [editSkus, setEditSkus] = useState<IUpdateProductSkuRequest[]>([]);

  const loadProductDetail = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      setError("Missing product slug.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await adminProductUseCase.getProduct.execute(slug);
      if (response.status === "success" && response.data) {
        setProduct(response.data);
      } else {
        setError(response.message || "Failed to load product detail.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load product detail.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProductDetail();
  }, [loadProductDetail]);

  const startEdit = () => {
    if (!product) return;
    setEditPrice(product.base_price);
    setEditStatus(product.status);
    setEditTranslations(
      product.translations?.map((t) => ({
        language_id: t.language_id,
        name: t.name,
        description: t.description || "",
      })) ?? [],
    );
    setEditSkus(
      product.skus?.map((sku) => ({
        id: sku.id,
        sku_code: sku.sku_code,
        price: sku.price,
        stock: sku.stock,
      })) ?? [],
    );
    setIsEditing(true);
    setSaveError(null);
    setSuccessMessage(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const saveProduct = async () => {
    if (!product) return;
    setIsSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        base_price: Number(editPrice),
        status: Number(editStatus),
        translations: editTranslations,
        skus: editSkus.map((sku) => ({
          ...sku,
          price: Number(sku.price),
          stock: Number(sku.stock),
        })),
      };

      const response = await adminProductUseCase.updateProduct.execute(
        product.id,
        payload,
      );
      if (response.status === "success" && response.data) {
        setProduct(response.data);
        setIsEditing(false);
        setSuccessMessage("Product updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setSaveError(response.message || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      setSaveError("Failed to save product details.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    product,
    loading,
    error,
    router,
    isEditing,
    isSaving,
    saveError,
    successMessage,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    editTranslations,
    setEditTranslations,
    editSkus,
    setEditSkus,
    startEdit,
    cancelEdit,
    saveProduct,
  };
};
