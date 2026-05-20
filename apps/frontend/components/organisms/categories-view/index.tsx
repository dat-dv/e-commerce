"use client";

import { CategoryNavSidebar } from "@/components/molecules/category-nav-sidebar";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import { TCategory } from "@/domain/categories/types/categories.model";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import CategoryHeader from "./categories-header";
import { CategoriesContent } from "./content";

const findCategoryById = (
  categories: TCategory[],
  id: string,
): TCategory | null => {
  for (const category of categories) {
    if (category.id === id) return category;

    const found = category.children
      ? findCategoryById(category.children, id)
      : null;
    if (found) return found;
  }

  return null;
};

export const CategoriesView = () => {
  const t = useTranslations("CategoriesPage.header");
  const categoriesTree = useCategoriesStore((s) => s.categories);
  const [activeId, setActiveId] = useState<string>("all");

  const parentCategories = useMemo<TCategory[]>(
    () =>
      categoriesTree.map(({ id, name, slug }) => ({
        id,
        name,
        slug,
      })),
    [categoriesTree],
  );

  const activeCategory = findCategoryById(categoriesTree, activeId);

  const title = activeCategory ? activeCategory.name : t("allTitle");
  const description = activeCategory
    ? t("categoryDescription", { category: activeCategory.name })
    : t("allDescription");
  const categories = activeCategory
    ? activeCategory.children || []
    : categoriesTree;

  return (
    <SidebarLayout
      sidebar={
        <CategoryNavSidebar
          categories={parentCategories}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      }
      header={<CategoryHeader title={title} description={description} />}
    >
      <CategoriesContent categories={categories} activeId={activeId} />
    </SidebarLayout>
  );
};
