"use client";

import { motion } from "framer-motion";
import { ChevronDown, FolderTree, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Button as AriaButton,
  Disclosure,
  DisclosurePanel,
  Heading,
} from "react-aria-components";

import Input from "@/components/atoms/input";
import { TCategory } from "@/domain/categories/types/categories.model";
import { cn } from "@/utils/cn";
import {
  ICategoryNavSidebarProps,
  ICategoryTreeItemProps,
} from "./category-nav-sidebar.types";

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

function CategoryTreeItem({
  category,
  activeId,
  level,
  forceExpanded,
  onSelect,
}: ICategoryTreeItemProps) {
  const hasChildren = Boolean(category.children?.length);
  const isActive = category.id === activeId;
  const isActiveBranch = categoryHasActiveId(category, activeId);
  const [isExpanded, setIsExpanded] = useState(
    forceExpanded || isActiveBranch || level === 0,
  );

  useEffect(() => {
    if (forceExpanded || isActiveBranch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsExpanded(true);
    }
  }, [forceExpanded, isActiveBranch]);

  const itemButton = (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className={cn(
        "group relative flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-xl py-2 pr-3 text-left transition-colors",
        isActive ? "text-primary" : "text-content/55 hover:text-content",
      )}
      style={{ paddingLeft: `${12 + level * 10}px` }}
    >
      {isActive ? (
        <motion.div
          layoutId="active-category-sidebar"
          className="absolute inset-0 rounded-xl bg-primary/10"
          transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
        />
      ) : null}

      <span
        className={cn(
          "relative z-10 size-1.5 shrink-0 rounded-full transition-opacity",
          isActive
            ? "bg-primary opacity-100"
            : "bg-content/20 opacity-0 group-hover:opacity-100",
        )}
      />
      <span className="relative z-10 block truncate text-sm font-semibold capitalize">
        {category.name}
      </span>
    </button>
  );

  if (!hasChildren) {
    return (
      <div className="flex min-h-10 items-center gap-1.5">{itemButton}</div>
    );
  }

  return (
    <Disclosure isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
      {({ isExpanded: isDisclosureExpanded }) => (
        <div className="space-y-1">
          <Heading className="flex min-h-10 items-center gap-1.5">
            {itemButton}
            <AriaButton
              slot="trigger"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-content/35 outline-none transition-colors hover:bg-content/[0.05] hover:text-content focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label={
                isDisclosureExpanded
                  ? `Collapse ${category.name}`
                  : `Expand ${category.name}`
              }
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isDisclosureExpanded ? "rotate-180" : "rotate-0",
                )}
              />
            </AriaButton>
          </Heading>

          <DisclosurePanel className="ml-4 border-l border-content/[0.08] pl-2">
            <div className="flex flex-col gap-1 py-1">
              {category.children?.map((child) => (
                <CategoryTreeItem
                  key={child.id}
                  category={child}
                  activeId={activeId}
                  level={level + 1}
                  forceExpanded={forceExpanded}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}

export const CategoryNavSidebar = ({
  categories,
  activeId,
  setActiveId,
}: ICategoryNavSidebarProps) => {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(
    () => filterCategoriesByKeyword(categories, search),
    [categories, search],
  );
  const isSearching = search.trim().length > 0;

  return (
    <nav className="h-full overflow-hidden lg:h-[calc(100vh-190px)]">
      <div className="flex h-full flex-col gap-5 rounded-2xl border border-content/[0.06] bg-surface/80 p-4 shadow-sm shadow-content/[0.02] backdrop-blur-md">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderTree size={17} strokeWidth={2} />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight text-content">
                Categories
              </h2>
              <p className="text-xs font-medium text-content/35">
                Browse by collection
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content/25"
            />

            <Input
              placeholder="Search categories"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 rounded-xl border-content/[0.06] bg-content/[0.02] pl-10 pr-10 text-sm"
            />

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-content/30 transition-colors hover:bg-content/[0.06] hover:text-content"
                aria-label="Clear category search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setActiveId("all")}
              className={cn(
                "group relative flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
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
                All Categories
              </span>
            </button>

            {filteredCategories.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                activeId={activeId}
                level={0}
                forceExpanded={isSearching}
                onSelect={setActiveId}
              />
            ))}

            {filteredCategories.length === 0 ? (
              <div className="rounded-xl bg-content/[0.03] px-4 py-8 text-center">
                <p className="text-sm font-medium text-content/35">
                  No categories found
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavSidebar;
