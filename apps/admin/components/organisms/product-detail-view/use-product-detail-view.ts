"use client";

import {
  type IProductResponse,
  type IUpdateProductSkuRequest,
  type IUpdateProductTranslationRequest,
} from "@ecommerce/shared";
import { toast, useLoadOnce } from "@ecommerce/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { adminProductUseCase } from "@/domain/product";

export const useProductDetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  useLoadOnce(loadProductDetail, !!slug);

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
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveProduct = () => {
    if (!product) return;

    startTransition(async () => {
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
    loading,
    error,
    router,
    isEditing,
    isSaving: isPending,
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
