import { useCallback } from "react";
import { productsUseCase } from "@/domain/products/use-cases";
import { useProductsPageStore } from "./use-products-page-store";

export const useProductsAdapter = () => {
  const { setProducts, setLoading, setPage } = useProductsPageStore(
    (state) => state,
  );
  const setFilters = useProductsPageStore((state) => state.setFilters);

  const fetchProducts = useCallback(
    async (params: {
      category_slug?: string;
      page?: number;
      limit?: number;
      sort?: string;
      search?: string;
      min_price?: number;
      max_price?: number;
      rating?: number;
    }) => {
      setLoading(true);
      try {
        const response = await productsUseCase.getProducts.execute(params);
        const listData = response.data;
        setProducts(
          listData.items,
          listData.meta.total,
          listData.meta.totalPages,
        );
        setFilters({
          sort: params.sort,
          search: params.search,
          min_price: params.min_price,
          max_price: params.max_price,
          rating: params.rating,
        });
        if (params.page) {
          setPage(params.page);
        }
      } catch (error) {
        console.error("Failed to fetch products in adapter:", error);
      } finally {
        setLoading(false);
      }
    },
    [setProducts, setLoading, setPage, setFilters],
  );

  return { fetchProducts };
};
