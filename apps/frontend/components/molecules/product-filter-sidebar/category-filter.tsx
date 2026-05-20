"use client";

import { FolderTree } from "lucide-react";
import { useMemo, useState } from "react";

import { FilterSection } from "@/components/molecules/filter-sidebar";
import { CategorySearchInput } from "./category-search-input";
import { CategoryTreeItem } from "./category-tree-item";
import { searchCategoryTree } from "./category-filter.utils";
import { ICategoryFilterSectionProps } from "./product-filter-sidebar.types";

import { useTranslations } from "next-intl";

export function CategoryFilterSection({
  categories,
  activeSlug,
  onCategoryChange,
}: ICategoryFilterSectionProps) {
  const t = useTranslations("ProductsPage");
  const [categoryKeyword, setCategoryKeyword] = useState("");

  const searchedCategories = useMemo(
    () => searchCategoryTree(categories, categoryKeyword),
    [categories, categoryKeyword],
  );

  const isSearchingCategory = categoryKeyword.trim().length > 0;

  return (
    <FilterSection
      title={t("categories")}
      icon={<FolderTree className="h-4 w-4 text-primary" />}
    >
      <CategorySearchInput
        value={categoryKeyword}
        placeholder={t("searchCategories")}
        clearLabel={t("clearCategorySearch")}
        onChange={setCategoryKeyword}
      />

      <div className="max-h-[42vh] overflow-y-auto pr-1">
        <div className="flex flex-col gap-1">
          {searchedCategories.length === 0 ? (
            <p className="rounded-xl bg-content/[0.03] px-3 py-4 text-center text-sm font-medium text-content/40">
              {t("noCategories")}
            </p>
          ) : (
            searchedCategories.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                activeSlug={activeSlug}
                level={0}
                forceExpanded={isSearchingCategory}
                onCategoryChange={onCategoryChange}
              />
            ))
          )}
        </div>
      </div>
    </FilterSection>
  );
}

export default CategoryFilterSection;
