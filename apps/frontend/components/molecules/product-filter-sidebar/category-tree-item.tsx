"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Button as AriaButton,
  Disclosure,
  DisclosurePanel,
  Heading,
} from "react-aria-components";

import { cn } from "@/utils/cn";
import { ICategoryTreeItemProps } from "./product-filter-sidebar.types";
import { categoryHasActiveSlug } from "./category-filter.utils";

export function CategoryTreeItem({
  category,
  activeSlug,
  level,
  forceExpanded = false,
  onCategoryChange,
}: ICategoryTreeItemProps) {
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
