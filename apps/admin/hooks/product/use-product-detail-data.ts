"use client";

import { toast, useLoadOnce } from "@ecommerce/ui";
import { useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { adminProductUseCase, type IAdminProduct } from "@/domain/product";

export const useProductDetailData = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<IAdminProduct | null>(null);
  const [loading, startLoadingTransition] = useTransition();

  const loadProductDetail = useCallback(() => {
    if (!slug) {
      toast.error("Missing product slug.");
      return;
    }

    startLoadingTransition(async () => {
      try {
        const response = await adminProductUseCase.getProduct.execute(slug);
        setProduct(response);
      } catch {
        toast.error("Failed to load product detail.");
      }
    });
  }, [slug]);

  useLoadOnce(loadProductDetail, !!slug);

  return { product, loading, setProduct, loadProductDetail };
};
