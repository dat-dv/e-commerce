"use client";

import React from "react";
import { motion } from "framer-motion";

import { TCategory } from "@/domain/categories/types/categories.model";
import { cn } from "@/utils/cn";

interface FilterSidebarProps {
  categories: TCategory[];
  children?: React.ReactNode;
  onCategoryChange: (slug: string) => void;
  hideCategories?: boolean;
  activeSlug?: string;
}

export function FilterSidebar({
  categories,
  children,
  onCategoryChange,
  hideCategories = false,
  activeSlug,
}: FilterSidebarProps) {
  return (
    <div
      className={cn(
        "h-fit rounded-2xl border border-content/[0.06] bg-surface/90 p-4 shadow-sm shadow-content/[0.02] backdrop-blur-md",
      )}
    >
      {!hideCategories && (
        <div className="border-b border-content/[0.06] pb-5">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-content/45">
            Categories
          </h3>

          <div className="flex flex-col gap-1.5">
            {categories.length === 0 && (
              <p className="text-sm text-content/50">No categories found.</p>
            )}

            {categories.map((cat) => {
              const isActive = activeSlug === cat.slug;

              return (
                <div key={cat.id} className="flex flex-col gap-1">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCategoryChange(cat.slug)}
                    className={cn(
                      "min-h-10 rounded-xl px-3 py-2 text-left text-sm capitalize transition-all",
                      isActive
                        ? "bg-primary/10 font-bold text-primary"
                        : "text-content/70 hover:bg-content/5 hover:text-content",
                    )}
                  >
                    {cat.name}
                  </motion.button>

                  {cat.children && cat.children.length > 0 && (
                    <div className="ml-4 flex flex-col gap-1 border-l border-content/10 pl-2">
                      {cat.children.map((child) => {
                        const isChildActive = activeSlug === child.slug;

                        return (
                          <motion.button
                            key={child.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onCategoryChange(child.slug)}
                            className={cn(
                              "min-h-9 rounded-lg px-3 py-1.5 text-left text-sm transition-all",
                              isChildActive
                                ? "bg-primary/5 font-semibold text-primary"
                                : "text-content/50 hover:bg-content/5 hover:text-content",
                            )}
                          >
                            {child.name}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 pt-5">{children}</div>
    </div>
  );
}
