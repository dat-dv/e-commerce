"use client";

import { useProductsStore } from "@/hooks/products/use-products-store";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { useState } from "react";

export const useHomepageCategories = () => {
  const categories = useCategoriesStore((state) => state.categories);
  const pagination = useCategoriesStore((state) => state.pagination);
  const hydrate = useCategoriesStore((state) => state.hydrate);
  const lang = useProductsStore((state) => state.lang);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 16;

  const fetchMore = async () => {
    if (loading) return;
    if (pagination && page >= pagination.totalPages) return;

    setLoading(true);

    try {
      const nextPage = page + 1;
      const response = await categoriesUseCase.getCategories.execute({
        page: nextPage,
        limit,
        level: 1,
      });

      if (response.status === "success") {
        const items = response.data.items || [];
        const meta = response.data.meta;

        if (items.length > 0) {
          hydrate({
            categories: [...categories, ...items],
            pagination: meta,
          });
          setPage(nextPage);
        }
      }
    } catch (error) {
      console.error(
        "[useHomepageCategories] Failed to fetch more categories:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    lang,
    loading,
    fetchMore,
    pagination,
  };
};
