"use client";

import React from "react";
import { TCategory } from "@/domain/categories/types/categories.model";
import { motion } from "framer-motion";

interface FilterSidebarProps {
  categories: TCategory[];
  children?: React.ReactNode;
  onCategoryChange: (slug: string) => void;
  hideCategories?: boolean;
}

export function FilterSidebar({
  categories,
  children,
  onCategoryChange,
  hideCategories = false,
}: FilterSidebarProps) {
  return (
    <div className="bg-surface/80 border border-content/[0.05] backdrop-blur-md rounded-xl p-4 flex flex-col gap-6 shadow-sm h-fit sticky top-24">
      {!hideCategories && (
        <div>
          <h3 className="font-semibold text-sm mb-3 text-content">
            Categories
          </h3>
          <div className="flex flex-col gap-1.5">
            {categories.length === 0 && (
              <p className="text-content/50 text-sm">No categories found.</p>
            )}

            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col gap-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`capitalize text-left px-3 py-2 rounded-xl transition-all ${
                    window.location.pathname.includes(cat.slug)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-content/70 hover:bg-content/5 hover:text-content"
                  }`}
                >
                  {cat.name}
                </motion.button>
                {cat.children && cat.children.length > 0 && (
                  <div className="ml-4 flex flex-col gap-1 border-l border-content/10 pl-2">
                    {cat.children.map((child) => (
                      <motion.button
                        key={child.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onCategoryChange(child.slug)}
                        className={`text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                          window.location.pathname.includes(child.slug)
                            ? "bg-primary/5 text-primary font-medium"
                            : "text-content/50 hover:bg-content/5 hover:text-content"
                        }`}
                      >
                        {child.name}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
