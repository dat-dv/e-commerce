"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { adminProductUseCase, type IAdminProduct } from "@/domain/product";
import usePagination from "@/hooks/use-pagination";

export const useProductsView = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, getFirstPage, onChangePagination, onChangeFilter } =
    usePagination<IAdminProduct>({
      initialData: null,
      isSyncWithSearchParams: false,
      fetchPage: async (params) => {
        setError(null);
        try {
          const response = await adminProductUseCase.getProducts.execute({
            page: params.page ?? 1,
            limit: params.limit ?? 12,
            search: params.search,
          });
          return {
            data: {
              items: response.items,
              meta: response.meta,
            },
          };
        } catch (err: unknown) {
          console.error(err);
          setError("Failed to fetch product data. Please try again.");
          throw err;
        }
      },
    });

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    onChangeFilter([{ key: "search", value: q }]);
  };

  const router = useRouter();

  const handleViewDetail = (product: IAdminProduct) => {
    router.push(APP_ROUTES.PRODUCT_DETAIL(product.slug));
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
    setPage: onChangePagination,
    setPageSize: (limit: number) => getFirstPage({ page: 1, limit }),
    setSearchQuery: handleSearch,
    handleViewDetail,
  };
};
