import { useCallback } from "react";
import { productsUseCase } from "@/domain/products/use-cases";
import { useProductsPageStore } from "./use-products-page-store";

export const useProductsAdapter = () => {
  const { setProducts, setLoading, setPage } = useProductsPageStore(
    (state) => state,
  );

  const fetchProducts = useCallback(
    async (params: {
      category_slug?: string;
      page?: number;
      limit?: number;
      sort?: string;
      search?: string;
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
        if (params.page) {
          setPage(params.page);
        }
      } catch (error) {
        console.error("Failed to fetch products in adapter:", error);
      } finally {
        setLoading(false);
      }
    },
    [setProducts, setLoading, setPage],
  );

  return { fetchProducts };
};
