"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { cn } from "../../../utils";
import { IPaginationProps } from "./pagination.types";

const getPaginationRange = (currentPage: number, totalPages: number) => {
  const MAX_ITEMS = 7;
  const pages: (number | string)[] = [];

  if (totalPages <= MAX_ITEMS) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, "…", totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(
      1,
      "…",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );
  } else {
    pages.push(
      1,
      "…",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "…",
      totalPages,
    );
  }

  return pages;
};

const PaginationItem = ({
  page,
  active,
  onClick,
}: {
  page: number | string;
  active: boolean;
  onClick: (page: number) => void;
}) => {
  if (typeof page === "string") {
    return (
      <span className="flex h-8 w-5 items-center justify-center text-xs font-bold opacity-20 sm:h-10 sm:w-8 sm:text-sm">
        {page}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick(page)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-300 sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm",
        active
          ? "bg-primary shadow-primary/25 z-10 text-white shadow-lg sm:scale-110"
          : "text-content/40 hover:text-content border border-white/5 bg-white/5 hover:bg-white/10 active:scale-90",
      )}
    >
      {page}
    </button>
  );
};

const PaginationArrow = ({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "border-content/10 text-content/60 hover:text-content flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white/5 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10 sm:rounded-xl",
        !disabled && "active:scale-90",
      )}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
    </button>
  );
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel = "Previous page",
  nextLabel = "Next page",
  className,
}: IPaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageSelect = (page: number) => {
    onPageChange(page);
  };

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 flex w-full items-center justify-center gap-1.5 py-4 duration-500 sm:gap-4",
        className,
      )}
    >
      <PaginationArrow
        direction="left"
        disabled={currentPage === 1}
        label={previousLabel}
        onClick={() => handlePageSelect(Math.max(1, currentPage - 1))}
      />

      <div className="flex min-w-0 items-center gap-1 sm:gap-2">
        {pages.map((p, i) => (
          <PaginationItem
            key={`${p}-${i}`}
            page={p}
            active={currentPage === p}
            onClick={handlePageSelect}
          />
        ))}
      </div>

      <PaginationArrow
        direction="right"
        disabled={currentPage === totalPages}
        label={nextLabel}
        onClick={() => handlePageSelect(Math.min(totalPages, currentPage + 1))}
      />
    </nav>
  );
};

Pagination.displayName = "Pagination";

export default Pagination;
