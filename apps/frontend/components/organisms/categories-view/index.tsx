"use client";

import { useState } from "react";
import AppContainer from "@/components/atoms/app-container";
import { CategoriesContent } from "./content";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { CategoriesSidebar } from "@/components/molecules/caterogies-sidebar";
import CategoryHeader from "./categories-header";
import SidebarLayout from "@/components/molecules/sidebar-layout";

export const CategoriesView = () => {
  const categoriesTree = useCategoriesStore((s) => s.categories);
  const [activeId, setActiveId] = useState<string>("all");

  const activeCategory = categoriesTree.find((cat) => cat.id === activeId);

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
        <CategoriesSidebar
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
