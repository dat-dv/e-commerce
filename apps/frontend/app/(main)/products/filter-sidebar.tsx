"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TCategory } from "@/domain/categories/types/categories.model";
import { motion } from "framer-motion";

interface FilterSidebarProps {
  categories: TCategory[];
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category_id");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset về trang 1
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-surface/80 border border-content/[0.05] backdrop-blur-md rounded-xl p-4 flex flex-col gap-6 shadow-sm h-fit sticky top-24">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-content">
          Categories
        </h3>
        <div className="flex flex-col gap-1.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateFilter("category_id", null)}
            className={`text-left px-2.5 py-1.5 rounded-lg text-sm transition-all ${
              !currentCategory
                ? "bg-primary text-white font-medium"
                : "text-content/70 hover:bg-content/5 hover:text-content"
            }`}
          >
            All Categories
          </motion.button>
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateFilter("category_id", cat.id)}
                className={`text-left px-3 py-2 rounded-xl transition-all ${
                  currentCategory === cat.id
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
                      onClick={() => updateFilter("category_id", child.id)}
                      className={`text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                        currentCategory === child.id
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

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-content">Price Range</h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 rounded-xl bg-content/[0.03] border border-content/10 focus:outline-none focus:border-primary transition-all text-sm"
              onBlur={(e) => updateFilter("min_price", e.target.value)}
              defaultValue={searchParams.get("min_price") || ""}
            />
            <span className="text-content/40">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 rounded-xl bg-content/[0.03] border border-content/10 focus:outline-none focus:border-primary transition-all text-sm"
              onBlur={(e) => updateFilter("max_price", e.target.value)}
              defaultValue={searchParams.get("max_price") || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
