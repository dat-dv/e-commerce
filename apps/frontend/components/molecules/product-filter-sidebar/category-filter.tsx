"use client";

import { motion } from "framer-motion";
import { ChevronDown, FolderTree, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Button as AriaButton,
  Disclosure,
  DisclosurePanel,
  Heading,
} from "react-aria-components";

import { FilterSection } from "@/components/molecules/filter-sidebar";
import { TCategory } from "@/domain/categories/types/categories.model";
import { cn } from "@/utils/cn";
import {
  ICategoryFilterSectionProps,
  ICategoryTreeItemProps,
} from "./product-filter-sidebar.types";

import { useTranslations } from "next-intl";

const categoryHasActiveSlug = (
  category: TCategory,
  activeSlug?: string,
): boolean => {
  if (!activeSlug) return false;
  if (category.slug === activeSlug) return true;

  return (
    category.children?.some((child) =>
      categoryHasActiveSlug(child, activeSlug),
    ) ?? false
  );
};

const searchCategoryTree = (
  categories: TCategory[],
  keyword: string,
): TCategory[] => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) return categories;

  return categories.reduce<TCategory[]>((result, category) => {
    const matchedChildren = category.children
      ? searchCategoryTree(category.children, normalizedKeyword)
      : [];

    const matchedSelf =
      category.name.toLowerCase().includes(normalizedKeyword) ||
      category.slug.toLowerCase().includes(normalizedKeyword);

    if (!matchedSelf && matchedChildren.length === 0) return result;

    result.push({
      ...category,
      children: matchedSelf ? category.children : matchedChildren,
    });

    return result;
  }, []);
};

function CategoryTreeItem({
  category,
  activeSlug,
  level,
  forceExpanded = false,
  onCategoryChange,
}: ICategoryTreeItemProps) {
  const t = useTranslations("ProductsPage");
  const hasChildren = Boolean(category.children?.length);
  const isActive = activeSlug === category.slug;
  const isActiveBranch = categoryHasActiveSlug(category, activeSlug);

  const defaultExpanded = forceExpanded || isActiveBranch || level === 0;

  const itemButton = (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onCategoryChange(category.slug)}
      className={cn(
        "min-w-0 flex-1 rounded-lg px-3 py-2 text-left text-sm capitalize transition-colors",
        isActive
          ? "bg-primary/10 font-bold text-primary"
          : "text-content/65 hover:bg-content/[0.05] hover:text-content",
      )}
      style={{ paddingLeft: `${12 + level * 10}px` }}
    >
      <span className="block truncate">{category.name}</span>
    </motion.button>
  );

  if (!hasChildren) {
    return (
      <div className="flex min-h-9 items-center gap-1.5">{itemButton}</div>
    );
  }

  return (
    <Disclosure defaultExpanded={defaultExpanded}>
      {({ isExpanded }) => (
        <div className="space-y-1">
          <Heading className="flex min-h-9 items-center gap-1.5">
            {itemButton}

            <AriaButton
              slot="trigger"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-content/35 outline-none transition-colors hover:bg-content/[0.05] hover:text-content focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label={
                isExpanded
                  ? `Collapse ${category.name}`
                  : `Expand ${category.name}`
              }
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded ? "rotate-180" : "rotate-0",
                )}
              />
            </AriaButton>
          </Heading>

          <DisclosurePanel className="ml-3 border-l border-content/[0.08] pl-2">
            <div className="flex flex-col gap-1 py-1">
              {category.children?.map((child) => (
                <CategoryTreeItem
                  key={child.id}
                  category={child}
                  activeSlug={activeSlug}
                  level={level + 1}
                  forceExpanded={forceExpanded}
                  onCategoryChange={onCategoryChange}
                />
              ))}
            </div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}

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
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-content/[0.08] bg-content/[0.03] px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-content/30" />

        <input
          value={categoryKeyword}
          onChange={(event) => setCategoryKeyword(event.target.value)}
          placeholder={t("searchCategories")}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-content outline-none placeholder:text-content/35"
        />

        {categoryKeyword ? (
          <button
            type="button"
            onClick={() => setCategoryKeyword("")}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-content/35 transition-colors hover:bg-content/[0.06] hover:text-content"
            aria-label="Clear category search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

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
