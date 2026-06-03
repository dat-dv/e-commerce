"use client";

import { EProductSort } from "@ecommerce/shared";
import type { PaginationQueryParams, TableSortDirection } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { adminProductUseCase, type IAdminProduct } from "@/domain/product";
import usePagination from "@/hooks/use-pagination";
import { getTableSortValue, type TableSortValueMap } from "@/utils/table-sort";

type ProductsViewPaginationParams = PaginationQueryParams & {
  sort?: EProductSort;
};

const PRODUCT_SORT_VALUE_MAP: TableSortValueMap<EProductSort> = {
  basePrice: {
    asc: EProductSort.PRICE_ASC,
    desc: EProductSort.PRICE_DESC,
  },
};

export const useProductsView = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, getFirstPage, onChangePagination, onChangeFilter } =
    usePagination<IAdminProduct, ProductsViewPaginationParams>({
      initialData: null,
      isSyncWithSearchParams: false,
      fetchPage: async (params) => {
        setError(null);
        try {
          const response = await adminProductUseCase.getProducts.execute({
            page: params.page ?? 1,
            limit: params.limit ?? 12,
            search: params.search,
            sort: params.sort ?? undefined,
          });
          return {
            data: {
              items: response.items,
              meta: response.meta,
            },
          };
        } catch (err) {
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

  const handleSortChange = (
    column?: string,
    direction?: TableSortDirection,
  ) => {
    onChangeFilter([
      {
        key: "sort",
        value: getTableSortValue(column, direction, PRODUCT_SORT_VALUE_MAP),
      },
    ]);
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
    setSort: handleSortChange,
    handleViewDetail,
  };
};
