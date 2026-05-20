"use client";

import Button from "@/components/atoms/button";
import { CategoryNavSidebar } from "@/components/molecules/category-nav-sidebar";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import { TCategory } from "@/domain/categories/types/categories.model";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CategoriesFilterDrawer } from "./categories-filter-drawer";
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
  const tSidebar = useTranslations("CategoriesPage.sidebar");
  const categoriesTree = useCategoriesStore((s) => s.categories);
  const [activeId, setActiveId] = useState<string>("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      sidebarClassName="hidden lg:block"
      header={<CategoryHeader title={title} description={description} />}
    >
      <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            {tSidebar("title")}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-content/45">
            {activeCategory?.name || tSidebar("allCategories")}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => setIsDrawerOpen(true)}
          className="h-10 shrink-0 rounded-full border border-content/10 px-3 text-sm text-content/70 hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
        >
          <SlidersHorizontal size={16} />
          {tSidebar("filterButton")}
        </Button>
      </div>

      <CategoriesContent categories={categories} activeId={activeId} />
      <CategoriesFilterDrawer
        isOpen={isDrawerOpen}
        categories={parentCategories}
        activeId={activeId}
        setActiveId={setActiveId}
        onClose={() => setIsDrawerOpen(false)}
      />
    </SidebarLayout>
  );
};
