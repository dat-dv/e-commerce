"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Dropdown } from "@/components/molecules/dropdown";
import { EProductSort } from "@ecommerce/shared";

interface ProductsToolbarProps {
  total: number;
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
}

export function ProductsToolbar({
  total,
  currentPage,
  totalPages,
  isLoading = false,
}: ProductsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort =
    searchParams.get("sort") || EProductSort.DEFAULT.toString();

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    const path = window.location.pathname;
    router.push(`${path}?${params.toString()}`);
  };

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    const path = window.location.pathname;
    router.push(`${path}?${params.toString()}`);
  };

  const sortOptions = [
    { value: EProductSort.DEFAULT, label: "Newest" },
    { value: EProductSort.BUY_MOST, label: "Best Selling" },
    { value: EProductSort.PRICE_ASC, label: "Price: Low to High" },
    { value: EProductSort.PRICE_DESC, label: "Price: High to Low" },
  ];

  const currentSortOption =
    sortOptions.find((opt) => opt.value.toString() === currentSort) ||
    sortOptions[0];

  return (
    <div className="relative z-30 bg-content/[0.02] border border-content/[0.05] backdrop-blur-xl rounded-2xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg shadow-content/[0.01]">
      {/* Left side: Info & Pagination */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <div className="text-sm font-medium text-content/70">
          Showing <span className="text-content font-bold">{total}</span>{" "}
          products
        </div>

        <div className="flex items-center gap-2 bg-content/[0.03] rounded-xl p-1 border border-content/[0.05]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-content/5 text-content transition-colors"
          >
            <ChevronLeft size={16} />
          </motion.button>

          <span className="text-xs font-semibold px-2 text-content/70">
            {currentPage} <span className="text-content/30">/</span>{" "}
            {totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-content/5 text-content transition-colors"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* Right side: Sort Options */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="hidden md:flex items-center gap-2 text-content/40 mr-2">
          <SlidersHorizontal size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Sort By
          </span>
        </div>

        <Dropdown
          trigger={
            <button
              disabled={isLoading}
              className="flex items-center gap-3 px-4 py-2.5 bg-content/[0.03] hover:bg-content/5 border border-content/[0.05] rounded-2xl transition-all group min-w-[180px] justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xs font-bold text-content/70 group-hover:text-content">
                {isLoading ? "Loading..." : currentSortOption.label}
              </span>
              <ChevronDown
                size={14}
                className="text-content/30 group-hover:text-content transition-colors"
              />
            </button>
          }
        >
          <div className="flex flex-col gap-1 min-w-[220px]">
            <div className="px-3 py-2 mb-1 border-b border-content/[0.05]">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-content/30">
                Sort Products By
              </span>
            </div>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSort(option.value.toString())}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  currentSort === option.value.toString()
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-content/60 hover:text-content hover:bg-content/5"
                }`}
              >
                {option.label}
                {currentSort === option.value.toString() && (
                  <motion.div
                    layoutId="active-sort"
                    className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>
            ))}
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

export default ProductsToolbar;
