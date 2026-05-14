"use client";

import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { useConfig } from "../config/use-config";

export const useCategories = () => {
  const treeCategories = useCategoriesStore((state) => state.categories);
  const { language: lang } = useConfig();

  return {
    treeCategories,
    lang,
  };
};
