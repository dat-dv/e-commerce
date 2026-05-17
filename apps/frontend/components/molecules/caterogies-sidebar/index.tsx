"use client";

import { useMemo, useState } from "react";
import { Search, Grid2X2 } from "lucide-react";

import Input from "@/components/atoms/input";
import CategoryItem from "./category-item";
import { TCategory } from "@/domain/categories/types/categories.model";

interface CategoriesSidebarProps {
  categories: TCategory[];
  activeId: string;
  setActiveId: (id: string) => void;
}

export const CategoriesSidebar = ({
  categories,
  activeId,
  setActiveId,
}: CategoriesSidebarProps) => {
  const [search, setSearch] = useState("");
  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return categories;

    return categories.filter((category) =>
      category.name.toLowerCase().includes(keyword),
    );
  }, [categories, search]);

  return (
    <aside className="sticky top-44 h-[calc(100vh-120px)] w-[280px] shrink-0 overflow-hidden border-r border-content/[0.04] pr-5">
      <div className="flex h-full flex-col gap-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Grid2X2 size={17} strokeWidth={2} />
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
              placeholder="Search filteredCategories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-2xl border-content/[0.06] bg-transparent pl-10 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
          <div className="flex flex-col gap-1.5">
            <CategoryItem
              label="All Categories"
              active={activeId === "all"}
              onClick={() => setActiveId("all")}
            />

            {filteredCategories.map((category) => (
              <CategoryItem
                key={category.id}
                label={category.name}
                active={category.id === activeId}
                onClick={() => setActiveId(category.id)}
              />
            ))}

            {filteredCategories.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-content/30">
                  No categories found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
