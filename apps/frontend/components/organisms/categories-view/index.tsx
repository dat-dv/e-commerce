"use client";

import { useState } from "react";
import { ICategory } from "@/domain/categories/types/categories.model";
import AppContainer from "@/components/atoms/app-container";
import { CategoriesSidebar } from "./sidebar";
import { CategoriesContent } from "./content";

export interface CategoriesViewProps {
  initialTree: ICategory[];
}

export const CategoriesView = ({ initialTree }: CategoriesViewProps) => {
  const [activeId, setActiveId] = useState<string>(initialTree[0]?.id || "");

  const activeCategory = initialTree.find((cat) => cat.id === activeId);

  return (
    <AppContainer className="py-10 flex gap-8">
      <CategoriesSidebar
        categories={initialTree}
        activeId={activeId}
        setActiveId={setActiveId}
      />
      <CategoriesContent activeCategory={activeCategory} />
    </AppContainer>
  );
};
