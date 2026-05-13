"use client";

import { useState } from "react";
import { ICategory } from "@/domain/categories/types/categories.model";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/input";

interface CategoriesSidebarProps {
  categories: ICategory[];
  activeId: string;
  setActiveId: (id: string) => void;
}

export const CategoriesSidebar = ({
  categories,
  activeId,
  setActiveId,
}: CategoriesSidebarProps) => {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-[300px] shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto bg-gradient-to-b from-white/80 to-neutral-50/80 backdrop-blur-xl border border-neutral-200/60 rounded-3xl p-6 shadow-xl shadow-neutral-100/50 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4 px-2 text-neutral-800">
          Categories
        </h2>
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/50"
        />
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {filteredCategories.map((category) => {
          const isActive = category.id === activeId;
          return (
            <button
              key={category.id}
              onClick={() => setActiveId(category.id)}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 text-left relative group",
                isActive
                  ? "text-primary font-semibold"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-bg"
                  className="absolute inset-0 bg-primary/10 rounded-xl -z-10 border border-primary/20"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-primary scale-100"
                    : "bg-transparent scale-0 group-hover:scale-100 group-hover:bg-neutral-300",
                )}
              />
              <span className="truncate capitalize">{category.name}</span>
            </button>
          );
        })}
        {filteredCategories.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-4">
            No categories found
          </p>
        )}
      </div>
    </div>
  );
};
