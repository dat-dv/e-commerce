"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface ProductsToolbarProps {
  total: number;
  currentPage: number;
  totalPages: number;
}

export function ProductsToolbar({
  total,
  currentPage,
  totalPages,
}: ProductsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";

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
    { value: "newest", label: "Newest" },
    { value: "best_selling", label: "Best Selling" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  return (
    <div className="bg-content/[0.02] border border-content/[0.05] backdrop-blur-xl rounded-2xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg shadow-content/[0.01]">
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

        <div className="flex flex-1 md:flex-none items-center gap-1 bg-content/[0.03] p-1 rounded-xl border border-content/[0.05]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSort(option.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentSort === option.value
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-content/40 hover:text-content hover:bg-content/5"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsToolbar;
