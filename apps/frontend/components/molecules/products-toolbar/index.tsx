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

import { Button } from "@ecommerce/ui";
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
  sortValue,
}: IListingProductsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Common.toolbar");

  const currentSort = sortValue || EProductSort.DEFAULT.toString();

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
        "bg-content/[0.02] border-content/[0.05] shadow-content/[0.01] relative z-30 mb-6 flex flex-col items-center justify-between gap-4 border p-3 shadow-lg backdrop-blur-xl md:flex-row",
      )}
    >
      {/* Left side: Info & Pagination */}
      <div className="flex w-full items-center justify-between gap-4 md:w-auto">
        <div className={`text-content/70 text-sm font-medium`}>
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
            "bg-content/[0.03] border-content/[0.05] flex items-center gap-2 border p-1",
          )}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className={cn(
              UI_RADIUS.control,
              "hover:bg-content/5 text-content p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30",
            )}
          >
            <ChevronLeft size={14} />
          </motion.button>

          <span
            className={`${TYPOGRAPHY.caption} text-content/70 px-1 font-semibold`}
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
              "hover:bg-content/5 text-content p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30",
            )}
          >
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* Right side: Sort Options */}
      <div className="flex w-full items-center gap-3 md:w-auto">
        <div className="text-content/40 mr-2 hidden items-center gap-2 md:flex">
          <SlidersHorizontal size={12} />
          <span
            className={`${TYPOGRAPHY.badge} font-black tracking-widest uppercase`}
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
                "border-content/[0.08] text-content hover:border-content/15 hover:bg-content/[0.025] flex min-w-[160px] items-center justify-between gap-3 border bg-transparent px-3.5 py-2 font-semibold shadow-none transition-colors",
              )}
            >
              <span
                className={`${TYPOGRAPHY.caption} text-content/70 font-bold`}
              >
                {currentSortOption.label}
              </span>
              <ChevronDown size={12} className="text-content/35" />
            </Button>
          )}
        >
          <div className="flex min-w-[200px] flex-col gap-0.5">
            <div className="border-content/[0.05] mb-0.5 border-b px-3 py-1.5">
              <span
                className={`${TYPOGRAPHY.badge} text-content/35 font-black tracking-[0.16em] uppercase`}
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
                    ? "bg-content/[0.06] text-content font-bold"
                    : "text-content/65 hover:text-content hover:bg-content/[0.04]",
                )}
              >
                {option.label}
                {currentSort === option.value.toString() && (
                  <motion.div
                    layoutId="active-sort"
                    className="bg-content/55 size-1.5 rounded-full"
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
