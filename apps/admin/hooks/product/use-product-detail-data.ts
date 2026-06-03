"use client";

import { useLoadOnce } from "@ecommerce/ui";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { adminProductUseCase, type IAdminProduct } from "@/domain/product";

export const useProductDetailData = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<IAdminProduct | null>(null);
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

  useLoadOnce(loadProductDetail, !!slug);

  return { product, loading, error, setProduct, loadProductDetail };
};
