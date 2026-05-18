"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type CategoryProductsFilterKey =
  | "search"
  | "sort"
  | "min_price"
  | "max_price"
  | "rating"
  | "page";

export const useCategoryProductsFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL query parameters to bind state
  const filterMinPrice = searchParams.get("min_price") || "";
  const filterMaxPrice = searchParams.get("max_price") || "";
  const filterRating = searchParams.get("rating") || "";
  const filterSort = searchParams.get("sort") || "";
  const filterSearch = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");

  const updateFilter = useCallback(
    (key: CategoryProductsFilterKey, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const submitSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const clearFilter = useCallback(
    (key: CategoryProductsFilterKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const changePage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return {
    filterMinPrice,
    filterMaxPrice,
    filterRating,
    filterSort,
    filterSearch,
    currentPage,
    updateFilter,
    submitSearch,
    clearFilter,
    resetFilters,
    changePage,
  };
};
