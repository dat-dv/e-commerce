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
import { IListingProductsToolbarProps } from "./products-toolbar.types";

import { useTranslations } from "next-intl";

export function ListingProductsToolbar({
  total,
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
  onSortChange,
}: IListingProductsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Common.toolbar");

  const currentSort =
    searchParams.get("sort") || EProductSort.DEFAULT.toString();

  const updateSort = (value: string) => {
    if (onSortChange) {
      onSortChange(value);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    const path = window.location.pathname;
    router.push(`${path}?${params.toString()}`);
  };

  const updatePage = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    const path = window.location.pathname;
    router.push(`${path}?${params.toString()}`);
  };

  const sortOptions = [
    { value: EProductSort.DEFAULT, label: t("sortOptions.newest") },
    { value: EProductSort.BUY_MOST, label: t("sortOptions.bestSelling") },
    { value: EProductSort.PRICE_ASC, label: t("sortOptions.priceLowToHigh") },
    { value: EProductSort.PRICE_DESC, label: t("sortOptions.priceHighToLow") },
  ];

  const currentSortOption =
    sortOptions.find((opt) => opt.value.toString() === currentSort) ||
    sortOptions[0];

  return (
    <div className="relative z-30 bg-content/[0.02] border border-content/[0.05] backdrop-blur-xl rounded-2xl p-3 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg shadow-content/[0.01]">
      {/* Left side: Info & Pagination */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <div className="text-sm font-medium text-content/70">
          {t.rich("showingProducts", {
            total,
            bold: (chunks) => (
              <span className="text-content font-bold">{chunks}</span>
            ),
          })}
        </div>

        <div className="flex items-center gap-2 bg-content/[0.03] rounded-xl p-1 border border-content/[0.05]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-content/5 text-content transition-colors"
          >
            <ChevronLeft size={14} />
          </motion.button>

          <span className="text-[11px] font-semibold px-1 text-content/70">
            {currentPage} <span className="text-content/30">/</span>{" "}
            {totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-content/5 text-content transition-colors"
          >
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* Right side: Sort Options */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="hidden md:flex items-center gap-2 text-content/40 mr-2">
          <SlidersHorizontal size={12} />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {t("sortBy")}
          </span>
        </div>

        <Dropdown
          trigger={
            <button
              disabled={isLoading}
              className="flex items-center gap-3 px-3.5 py-2 bg-content/[0.03] hover:bg-content/5 border border-content/[0.05] rounded-xl transition-all group min-w-[160px] justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-[11px] font-bold text-content/70 group-hover:text-content">
                {currentSortOption.label}
              </span>
              <ChevronDown
                size={12}
                className="text-content/30 group-hover:text-content transition-colors"
              />
            </button>
          }
        >
          <div className="flex flex-col gap-0.5 min-w-[200px]">
            <div className="px-3 py-1.5 mb-0.5 border-b border-content/[0.05]">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-content/30">
                {t("sortProductsBy")}
              </span>
            </div>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSort(option.value.toString())}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  currentSort === option.value.toString()
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-content/60 hover:text-content hover:bg-content/5"
                }`}
              >
                {option.label}
                {currentSort === option.value.toString() && (
                  <motion.div
                    layoutId="active-sort"
                    className="w-1 h-1 rounded-full bg-white"
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

export default ListingProductsToolbar;
