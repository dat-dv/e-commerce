"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Grid, List, ChevronLeft, ChevronRight, Search } from "lucide-react";

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
    router.push(`/products?${params.toString()}`);
  };

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-surface/80 border border-content/[0.05] backdrop-blur-md rounded-xl p-3 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
      <div className="flex items-center gap-2 text-content/70 text-xs">
        <span>
          Page <span className="font-semibold text-content">{currentPage}</span>/
          {totalPages}
        </span>
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1 rounded-md bg-content/[0.03] border border-content/[0.05] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-content/5 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1 rounded-md bg-content/[0.03] border border-content/[0.05] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-content/5 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-xs w-full sm:w-auto">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          defaultValue={searchParams.get("search") || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const params = new URLSearchParams(searchParams.toString());
              const value = e.currentTarget.value;
              if (value) {
                params.set("search", value);
              } else {
                params.delete("search");
              }
              params.set("page", "1");
              router.push(`/products?${params.toString()}`);
            }
          }}
          className="w-full pl-8 pr-3 py-1 rounded-lg bg-content/[0.02] border border-content/[0.05] focus:outline-none focus:border-primary transition-all text-xs text-content"
        />
        <Search className="w-3.5 h-3.5 text-content/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
      </div>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-content/50">Sort by:</span>
          <select
            value={currentSort}
            onChange={(e) => updateSort(e.target.value)}
            className="bg-content/[0.02] border border-content/[0.05] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-primary transition-all text-content"
          >
            <option value="newest">Mới nhất</option>
            <option value="best_selling">Bán chạy</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
          </select>
        </div>

        {/* View Toggle (Optional, just for UI) */}
        <div className="flex bg-content/[0.03] rounded-xl p-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-lg bg-surface shadow-sm text-primary"
          >
            <Grid className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-lg text-content/40 hover:text-content/70"
          >
            <List className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
