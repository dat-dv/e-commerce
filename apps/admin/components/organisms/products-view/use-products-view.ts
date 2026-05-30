"use client";

import type { IProductResponse } from "@ecommerce/shared";
import { useMemo, useState } from "react";

import { adminProductUseCase } from "@/domain/product";
import usePagination from "@/hooks/use-pagination";

export const useProductsView = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<IProductResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data, loading, onChangePagination } = usePagination<IProductResponse>(
    {
      initialData: null,
      isSyncWithSearchParams: false,
      fetchPage: async (params) => {
        setError(null);
        try {
          const response = await adminProductUseCase.getProducts.execute({
            page: params.page ?? 1,
            limit: params.limit ?? 12,
          });
          return {
            data: {
              items: response.data?.items ?? [],
              meta: response.data?.meta ?? {
                total: 0,
                page: params.page ?? 1,
                limit: params.limit ?? 12,
                totalPages: 0,
              },
            },
            message: response.message,
            timestamp: response.timestamp || new Date().toISOString(),
            status: response.status as "success" | "fail",
          };
        } catch (err: unknown) {
          console.error(err);
          setError("Failed to fetch product data. Please try again.");
          throw err;
        }
      },
    },
  );

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return data.items;
    const q = searchQuery.toLowerCase();
    return data.items.filter(
      (p) =>
        p.slug.toLowerCase().includes(q) ||
        p.translations?.some((t) => t.name.toLowerCase().includes(q)),
    );
  }, [data.items, searchQuery]);

  const handleViewDetail = (product: IProductResponse) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return {
    products: data.items,
    loading,
    error,
    searchQuery,
    page: data.meta.page,
    limit: data.meta.limit,
    total: data.meta.total,
    totalPages: data.meta.totalPages,
    selectedProduct,
    isDetailOpen,
    filteredProducts,
    setPage: onChangePagination,
    setSearchQuery,
    setIsDetailOpen,
    handleViewDetail,
  };
};
