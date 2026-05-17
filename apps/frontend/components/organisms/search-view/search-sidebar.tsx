"use client";

import { ProductsFilterSidebar } from "@/components/organisms/products-view/products-filter-sidebar";
import { TCategory } from "@/domain/categories/types/categories.model";

interface SearchSidebarProps {
  categories: TCategory[];
  onFilterChange: (key: string, value: string | null) => void;
  onCategoryChange: (slug: string) => void;
}

export function SearchSidebar({
  categories,
  onFilterChange,
  onCategoryChange,
}: SearchSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <ProductsFilterSidebar
        categories={categories}
        onFilterChange={onFilterChange}
        onCategoryChange={onCategoryChange}
        hideCategories={true}
      />
    </div>
  );
}
