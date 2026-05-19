"use client";

import { motion } from "framer-motion";
import { FolderTree, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { type Key } from "react-aria-components";

import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import { Tree } from "@/components/atoms/tree";
import { TCategory } from "@/domain/categories/types/categories.model";
import { cn } from "@/utils/cn";
import { ICategoryNavSidebarProps } from "./category-nav-sidebar.types";

const categoryHasActiveId = (
  category: TCategory,
  activeId: string,
): boolean => {
  if (category.id === activeId) return true;

  return (
    category.children?.some((child) => categoryHasActiveId(child, activeId)) ??
    false
  );
};

const filterCategoriesByKeyword = (
  categories: TCategory[],
  keyword: string,
): TCategory[] => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return categories;

  return categories.reduce<TCategory[]>((result, category) => {
    const matchingChildren = category.children
      ? filterCategoriesByKeyword(category.children, normalizedKeyword)
      : [];
    const matchesSelf =
      category.name.toLowerCase().includes(normalizedKeyword) ||
      category.slug.toLowerCase().includes(normalizedKeyword);

    if (matchesSelf || matchingChildren.length > 0) {
      result.push({
        ...category,
        children: matchesSelf ? category.children : matchingChildren,
      });
    }

    return result;
  }, []);
};

const getCategoryIds = (items: TCategory[]): string[] => {
  return items.reduce<string[]>((acc, item) => {
    acc.push(item.id);
    if (item.children) {
      acc.push(...getCategoryIds(item.children));
    }
    return acc;
  }, []);
};

export const CategoryNavSidebar = ({
  categories,
  activeId,
  setActiveId,
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
    const activeBranchIds: string[] = [];
    const findActiveBranch = (items: TCategory[]) => {
      for (const item of items) {
        if (categoryHasActiveId(item, activeId)) {
          activeBranchIds.push(item.id);
          if (item.children) {
            findActiveBranch(item.children);
          }
        }
      }
    };
    findActiveBranch(categories);
    return new Set<Key>(activeBranchIds);
  });

  const selectedKeys = useMemo<Iterable<Key>>(() => {
    return activeId === "all" ? new Set<Key>() : new Set<Key>([activeId]);
  }, [activeId]);

  return (
    <nav className="h-full overflow-hidden lg:h-[calc(100vh-190px)]">
      <div className="flex h-full flex-col gap-5 rounded-2xl border border-content/[0.06] bg-surface/80 p-4 shadow-sm shadow-content/[0.02] backdrop-blur-md">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderTree size={17} strokeWidth={2} aria-hidden />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight text-content">
                {t("title")}
              </h2>
              <p className="text-xs font-medium text-content/35">
                {t("description")}
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content/25"
              aria-hidden
            />

            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 rounded-xl border-content/[0.06] bg-content/[0.02] pl-10 pr-10 text-sm"
            />

            {search ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-content/30 hover:bg-content/[0.06] hover:text-content p-0"
                aria-label={t("clearSearch")}
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveId("all")}
              className={cn(
                "group relative flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-left mb-1.5 h-auto justify-start",
                activeId === "all"
                  ? "text-primary"
                  : "text-content/55 hover:text-content",
              )}
            >
              {activeId === "all" ? (
                <motion.div
                  layoutId="active-category-sidebar"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 size-1.5 rounded-full transition-opacity",
                  activeId === "all"
                    ? "bg-primary opacity-100"
                    : "bg-content/20 opacity-0 group-hover:opacity-100",
                )}
              />
              <span className="relative z-10 truncate text-sm font-semibold">
                {t("allCategories")}
              </span>
            </Button>

            {filteredCategories.length > 0 ? (
              <Tree
                items={filteredCategories}
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  if (keys !== "all") {
                    const selected = Array.from(keys)[0];
                    if (selected !== undefined) {
                      setActiveId(selected.toString());
                    }
                  }
                }}
                expandedKeys={expandedKeys}
                onExpandedChange={setExpandedKeys}
                showDot
                activeLayoutId="active-category-sidebar"
                className="w-full border-none bg-transparent p-0 gap-1.5"
              />
            ) : (
              <div className="rounded-xl bg-content/[0.03] px-4 py-8 text-center">
                <p className="text-sm font-medium text-content/35">
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
