"use client";

import { FolderTree } from "lucide-react";
import { useMemo, useState } from "react";
import { type Key } from "react-aria-components";

import { Tree } from "@/components/atoms/tree";
import { FilterSection } from "@/components/molecules/filter-sidebar";
import {
  getActiveBranchSlugs,
  getCategorySlugs,
  searchCategoryTree,
} from "./category-filter.utils";
import { CategorySearchInput } from "./category-search-input";
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

  const [expandedKeys, setExpandedKeys] = useState<Iterable<Key>>(
    () =>
      new Set<Key>(
        isSearchingCategory
          ? getCategorySlugs(searchedCategories)
          : getActiveBranchSlugs(categories, activeSlug),
      ),
  );

  const selectedKeys = useMemo<Iterable<Key>>(() => {
    return activeSlug ? new Set<Key>([activeSlug]) : new Set<Key>();
  }, [activeSlug]);

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
            <Tree
              items={searchedCategories}
              getId={(item) => item.slug}
              selectedKeys={selectedKeys}
              selectionMode="single"
              selectionBehavior="replace"
              onSelectionChange={(keys) => {
                if (keys !== "all") {
                  const selected = Array.from(keys)[0];
                  if (selected !== undefined) {
                    onCategoryChange(selected.toString());
                  }
                }
              }}
              expandedKeys={expandedKeys}
              onExpandedChange={setExpandedKeys}
              showDot
              activeLayoutId="active-category-filter"
              className="w-full border-none bg-transparent p-0 gap-1.5"
            />
          )}
        </div>
      </div>
    </FilterSection>
  );
}

export default CategoryFilterSection;
