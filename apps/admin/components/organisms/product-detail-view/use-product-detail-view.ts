"use client";

import { type IProductResponse } from "@ecommerce/shared";
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

  return {
    product,
    loading,
    error,
    router,
  };
};
