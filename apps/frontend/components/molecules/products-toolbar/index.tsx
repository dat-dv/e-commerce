"use client";

import { EProductSort } from "@ecommerce/shared";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/atoms/button";
import { AppDropdown } from "@/components/molecules/dropdown";
import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { IListingProductsToolbarProps } from "./products-toolbar.types";

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
    <div
      className={cn(
        UI_RADIUS.panel,
        "relative z-30 bg-content/[0.02] border border-content/[0.05] backdrop-blur-xl p-3 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg shadow-content/[0.01]",
      )}
    >
      {/* Left side: Info & Pagination */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <div className={`text-sm font-medium text-content/70`}>
          {t.rich("showingProducts", {
            total,
            bold: (chunks: React.ReactNode) => (
              <span className="text-content font-bold">{chunks}</span>
            ),
          })}
        </div>

        <div
          className={cn(
            UI_RADIUS.control,
            "flex items-center gap-2 bg-content/[0.03] p-1 border border-content/[0.05]",
          )}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className={cn(
              UI_RADIUS.control,
              "p-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-content/5 text-content transition-colors",
            )}
          >
            <ChevronLeft size={14} />
          </motion.button>

          <span
            className={`${TYPOGRAPHY.caption} font-semibold px-1 text-content/70`}
          >
            {currentPage} <span className="text-content/30">/</span>{" "}
            {totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={cn(
              UI_RADIUS.control,
              "p-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-content/5 text-content transition-colors",
            )}
          >
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* Right side: Sort Options */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="hidden md:flex items-center gap-2 text-content/40 mr-2">
          <SlidersHorizontal size={12} />
          <span
            className={`${TYPOGRAPHY.badge} font-black uppercase tracking-widest`}
          >
            {t("sortBy")}
          </span>
        </div>

        <AppDropdown
          popoverClassName={cn(
            UI_RADIUS.popover,
            "border-content/[0.08] bg-surface p-1 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.45)] backdrop-blur-none dark:shadow-[0_12px_28px_-18px_rgba(0,0,0,0.65)]",
          )}
          trigger={({ ref, toggle, isOpen }) => (
            <Button
              ref={ref}
              onPress={toggle}
              isDisabled={isLoading}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              className={cn(
                UI_RADIUS.control,
                "flex min-w-[160px] items-center justify-between gap-3 border border-content/[0.08] bg-transparent px-3.5 py-2 font-semibold text-content shadow-none transition-colors hover:border-content/15 hover:bg-content/[0.025]",
              )}
            >
              <span
                className={`${TYPOGRAPHY.caption} font-bold text-content/70`}
              >
                {currentSortOption.label}
              </span>
              <ChevronDown size={12} className="text-content/35" />
            </Button>
          )}
        >
          <div className="flex min-w-[200px] flex-col gap-0.5">
            <div className="mb-0.5 border-b border-content/[0.05] px-3 py-1.5">
              <span
                className={`${TYPOGRAPHY.badge} font-black uppercase tracking-[0.16em] text-content/35`}
              >
                {t("sortProductsBy")}
              </span>
            </div>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSort(option.value.toString())}
                className={cn(
                  UI_RADIUS.control,
                  `flex items-center justify-between px-3 py-2.5 ${TYPOGRAPHY.caption} font-semibold transition-colors`,
                  currentSort === option.value.toString()
                    ? "bg-content/[0.06] font-bold text-content"
                    : "text-content/65 hover:text-content hover:bg-content/[0.04]",
                )}
              >
                {option.label}
                {currentSort === option.value.toString() && (
                  <motion.div
                    layoutId="active-sort"
                    className="size-1.5 rounded-full bg-content/55"
                  />
                )}
              </button>
            ))}
          </div>
        </AppDropdown>
      </div>
    </div>
  );
}

export default ListingProductsToolbar;
