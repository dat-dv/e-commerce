"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

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
    { value: "newest", label: "Mới nhất" },
    { value: "best_selling", label: "Bán chạy" },
    { value: "price_asc", label: "Giá: Thấp đến Cao" },
    { value: "price_desc", label: "Giá: Cao đến Thấp" },
  ];

  return (
    <div className="bg-content/[0.02] border border-content/[0.05] backdrop-blur-xl rounded-2xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg shadow-content/[0.01]">
      {/* Left side: Info & Pagination */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <div className="text-sm font-medium text-content/70">
          Hiển thị <span className="text-content font-bold">{total}</span> sản
          phẩm
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

      {/* Center: Search */}
      <div className="relative w-full md:max-w-xs">
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
              const path = window.location.pathname;
              router.push(`${path}?${params.toString()}`);
            }
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-content/[0.03] border border-content/[0.05] focus:outline-none focus:border-primary focus:bg-content/[0.05] transition-all text-sm text-content placeholder:text-content/30"
        />
        <Search
          size={16}
          className="text-content/40 absolute left-3.5 top-1/2 -translate-y-1/2"
        />
      </div>

      {/* Right side: Sort & View Toggle */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        {/* Styled Custom Select */}
        <div className="relative flex items-center gap-2 bg-content/[0.03] border border-content/[0.05] rounded-xl px-3 py-2 hover:bg-content/[0.05] transition-colors cursor-pointer group">
          <SlidersHorizontal size={14} className="text-content/50" />
          <span className="text-xs font-semibold text-content/50">
            Sắp xếp:
          </span>
          <select
            value={currentSort}
            onChange={(e) => updateSort(e.target.value)}
            className="appearance-none bg-transparent text-xs font-semibold text-content focus:outline-none cursor-pointer pr-4"
          >
            {sortOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-surface text-content"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none text-content/40 group-hover:text-content/70 transition-colors">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-content/[0.03] border border-content/[0.05] rounded-xl p-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-surface shadow-sm text-primary"
          >
            <Grid size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-content/40 hover:text-content/70 transition-colors"
          >
            <List size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
