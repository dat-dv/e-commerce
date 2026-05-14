"use client";

import { useState } from "react";
import AppContainer from "@/components/atoms/app-container";
import { CategoriesSidebar } from "./sidebar";
import { CategoriesContent } from "./content";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";

export interface CategoriesViewProps {}

export const CategoriesView = ({}: CategoriesViewProps) => {
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
    <AppContainer className="py-10 flex gap-8">
      <CategoriesSidebar
        categories={categoriesTree}
        activeId={activeId}
        setActiveId={setActiveId}
      />
      <CategoriesContent
        title={title}
        description={description}
        categories={categories}
        activeId={activeId}
      />
    </AppContainer>
  );
};
