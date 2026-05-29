"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { type Key } from "react-aria-components";

import { Tree } from "@ecommerce/ui";
import { TYPOGRAPHY } from "@/constants/typography";
import { AllCategoriesButton } from "./all-categories-button";
import { ICategoryNavSidebarProps } from "./category-nav-sidebar.types";
import {
  filterCategoriesByKeyword,
  getActiveBranchIds,
  getCategoryIds,
} from "./category-nav-sidebar.utils";
import { CategorySearchInput } from "./category-search-input";
import { CategorySidebarHeader } from "./category-sidebar-header";

export const CategoryNavSidebar = ({
  categories,
  activeId,
  setActiveId,
  onSelectCategory,
}: ICategoryNavSidebarProps) => {
  const t = useTranslations("CategoriesPage.sidebar");
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(
    () => filterCategoriesByKeyword(categories, search),
    [categories, search],
  );
  const isSearching = search.trim().length > 0;

  const [expandedKeys, setExpandedKeys] = useState<Iterable<Key>>(() => {
    if (isSearching) {
      return new Set<Key>(getCategoryIds(filteredCategories));
    }

    return new Set<Key>(getActiveBranchIds(categories, activeId));
  });

  const selectedKeys = useMemo<Iterable<Key>>(() => {
    return activeId === "all" ? new Set<Key>() : new Set<Key>([activeId]);
  }, [activeId]);

  return (
    <nav className="h-full overflow-hidden lg:h-[calc(100vh-190px)]">
      <div className="border-content/[0.06] bg-surface/80 shadow-content/[0.02] flex h-full flex-col gap-5 rounded-2xl border p-4 shadow-sm backdrop-blur-md">
        <div className="space-y-4">
          <CategorySidebarHeader
            title={t("title")}
            description={t("description")}
          />

          <CategorySearchInput
            value={search}
            placeholder={t("searchPlaceholder")}
            clearLabel={t("clearSearch")}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <AllCategoriesButton
              active={activeId === "all"}
              label={t("allCategories")}
              onPress={() => {
                setActiveId("all");
                onSelectCategory?.();
              }}
            />

            {filteredCategories.length > 0 ? (
              <Tree
                aria-label={t("title")}
                items={filteredCategories}
                selectedKeys={selectedKeys}
                selectionMode="single"
                selectionBehavior="replace"
                onSelectionChange={(keys) => {
                  if (keys !== "all") {
                    const selected = Array.from(keys)[0];
                    if (selected !== undefined) {
                      setActiveId(selected.toString());
                      onSelectCategory?.();
                    }
                  }
                }}
                expandedKeys={expandedKeys}
                onExpandedChange={setExpandedKeys}
                showDot
                activeLayoutId="active-category-sidebar"
                className="w-full gap-1.5 border-none bg-transparent p-0"
              />
            ) : (
              <div className="bg-content/[0.03] rounded-xl px-4 py-8 text-center">
                <p
                  className={`${TYPOGRAPHY.bodySmall} text-content/35 font-medium`}
                >
                  {t("empty")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavSidebar;
