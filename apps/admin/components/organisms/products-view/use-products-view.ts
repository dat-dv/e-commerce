"use client";

import type {
  IApiResponse,
  IProductListResponse,
  IProductResponse,
} from "@ecommerce/shared";
import { useCallback, useEffect, useMemo, useState } from "react";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

export const useProductsView = () => {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedProduct, setSelectedProduct] =
    useState<IProductResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchProducts = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<
          IApiResponse<IProductListResponse>
        >(API_ROUTES.PRODUCTS.LIST, { params: { page: currentPage, limit } });
        setProducts(response.data?.items ?? []);
        setTotal(response.data?.meta?.total ?? 0);
        setTotalPages(response.data?.meta?.totalPages ?? 0);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to fetch product data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.slug.toLowerCase().includes(q) ||
        p.translations?.some((t) => t.name.toLowerCase().includes(q)),
    );
  }, [products, searchQuery]);

  const handleViewDetail = (product: IProductResponse) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return {
    products,
    loading,
    error,
    searchQuery,
    page,
    limit,
    total,
    totalPages,
    selectedProduct,
    isDetailOpen,
    filteredProducts,
    setPage,
    setSearchQuery,
    setIsDetailOpen,
    handleViewDetail,
  };
};
