import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type BrandProductsFilterKey =
  | "q"
  | "sort"
  | "min_price"
  | "max_price"
  | "rating"
  | "category";

export const useBrandProductsFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL query parameters to bind state
  const filterMinPrice = searchParams.get("min_price") || "";
  const filterMaxPrice = searchParams.get("max_price") || "";
  const filterRating = searchParams.get("rating") || "";
  const filterSort = searchParams.get("sort") || "";
  const categorySlug = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";

  const updateFilter = useCallback(
    (key: BrandProductsFilterKey, value: string | null) => {
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

  const navigateToCategory = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (categorySlug === slug) {
        params.delete("category"); // Toggle off if clicked active category
      } else {
        params.set("category", slug);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [categorySlug, pathname, router, searchParams],
  );

  const submitSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const clearFilter = useCallback(
    (key: BrandProductsFilterKey) => {
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
    categorySlug,
    searchQuery,
    updateFilter,
    navigateToCategory,
    submitSearch,
    clearFilter,
    resetFilters,
    changePage,
  };
};
