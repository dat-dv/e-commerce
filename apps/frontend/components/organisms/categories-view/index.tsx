"use client";

import { useState } from "react";
import { CategoriesContent } from "./content";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { CategoryNavSidebar } from "@/components/molecules/category-nav-sidebar";
import CategoryHeader from "./categories-header";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import { TCategory } from "@/domain/categories/types/categories.model";

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
  const categoriesTree = useCategoriesStore((s) => s.categories);
  const [activeId, setActiveId] = useState<string>("all");

  const activeCategory = findCategoryById(categoriesTree, activeId);

  const title = activeCategory ? activeCategory.name : "All Categories";
  const description = activeCategory
    ? `Explore our curated collection of high-quality products in ${activeCategory.name}.`
    : "Explore all our product categories.";
  const categories = activeCategory
    ? activeCategory.children || []
    : categoriesTree;

  return (
    <SidebarLayout
      sidebar={
        <CategoryNavSidebar
          categories={categoriesTree}
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
