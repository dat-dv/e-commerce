"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProductFilterSidebar } from "@/components/molecules/product-filter-sidebar";
import { ProductsHeader } from "@/components/molecules/products-header";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { useProductsAdapter } from "@/hooks/products/use-products-adapter";
import { useProductsPageStore } from "@/hooks/products/use-products-page-store";
import { EProductSort } from "@ecommerce/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ProductsCatalog } from "./products-catalog";
import {
  findTopLevelCategoryForSlug,
  getActiveCategoryTitle,
} from "./products-view.utils";

import { useTranslations } from "next-intl";

interface ProductsViewProps {
  categorySlug: string;
}

export function ProductsView({ categorySlug }: ProductsViewProps) {
  const t = useTranslations("ProductsPage");
  const categories = useCategoriesStore((s) => s.categories);
  const { products, total, currentPage, totalPages, loading } =
    useProductsPageStore((state) => state);

  const { fetchProducts } = useProductsAdapter();

  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page");
  const sort = searchParams.get("sort");
  const search = searchParams.get("search");

  const updateFilter = (filters: { key: string; value: string | null }[]) => {
    const params = new URLSearchParams(searchParams.toString());

    filters.forEach(({ key, value }) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const navigateToCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`/categories/${slug}?${params.toString()}`);
  };

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    fetchProducts({
      category_slug: categorySlug,
      page: page ? parseInt(page) : 1,
      limit: PAGINATION_LIMITS.CATEGORIES,
      sort: sort || EProductSort.DEFAULT.toString(),
      search: search || undefined,
    });
  }, [categorySlug, page, sort, search, fetchProducts]);

  const activeCategory = categorySlug
    ? findTopLevelCategoryForSlug(categories, categorySlug)
    : null;

  const categoryTitle = categorySlug
    ? getActiveCategoryTitle(categories, categorySlug)
    : null;

  const displayTitle = categoryTitle || t("title");
  const description = t("description", {
    categoryTitle: categoryTitle || t("premiumProducts"),
  });

  const displayCategories = activeCategory ? [activeCategory] : categories;

  return (
    <AppContainer size="2xl" className="py-16">
      <ProductsHeader title={displayTitle} description={description} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilterSidebar
            categories={displayCategories}
            onFilterChange={updateFilter}
            onCategoryChange={navigateToCategory}
            minPriceValue={searchParams.get("min_price") || ""}
            maxPriceValue={searchParams.get("max_price") || ""}
            ratingValue={searchParams.get("rating") || ""}
            activeSlug={activeCategory?.slug || ""}
          />
        </div>

        <ProductsCatalog
          products={products}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          pageStr={page}
          categoryTitle={displayTitle}
        />
      </div>
    </AppContainer>
  );
}
