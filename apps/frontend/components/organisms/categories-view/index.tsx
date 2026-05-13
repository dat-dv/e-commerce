"use client";

import { useState } from "react";
import { TCategory } from "@/domain/categories/types/categories.model";
import AppContainer from "@/components/atoms/app-container";
import { CategoriesSidebar } from "./sidebar";
import { CategoriesContent } from "./content";

export interface CategoriesViewProps {
  initialTree: TCategory[];
}

export const CategoriesView = ({ initialTree }: CategoriesViewProps) => {
  const [activeId, setActiveId] = useState<string>("all");

  const activeCategory = initialTree.find((cat) => cat.id === activeId);

  const title = activeCategory ? activeCategory.name : "All Categories";
  const description = activeCategory
    ? `Explore our curated collection of high-quality products in ${activeCategory.name}.`
    : "Explore all our product categories.";
  const categories = activeCategory
    ? activeCategory.children || []
    : initialTree;

  return (
    <AppContainer className="py-10 flex gap-8">
      <CategoriesSidebar
        categories={initialTree}
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
