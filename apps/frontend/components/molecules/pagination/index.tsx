"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/utils/cn";

const getPaginationRange = (currentPage: number, totalPages: number) => {
  const MAX_ITEMS = 7;
  const pages: (number | string)[] = [];

  if (totalPages <= MAX_ITEMS) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );
  } else {
    pages.push(
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
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
      <span className="flex h-10 w-8 items-center justify-center text-sm opacity-20 font-bold">
        {page}
      </span>
    );
  }

  return (
    <button
      onClick={() => onClick(page as number)}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 font-bold text-sm",
        active
          ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110 z-10"
          : "bg-white/5 border border-white/5 text-content/40 hover:bg-white/10 hover:text-content active:scale-90",
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
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-content/10 text-content/60 transition-all hover:bg-white/10 hover:text-content disabled:opacity-30 disabled:cursor-not-allowed",
        !disabled && "active:scale-90",
      )}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-4 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PaginationArrow
        direction="left"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      />

      <div className="flex items-center gap-2">
        {pages.map((p, i) => (
          <PaginationItem
            key={i}
            page={p}
            active={currentPage === p}
            onClick={onPageChange}
          />
        ))}
      </div>

      <PaginationArrow
        direction="right"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      />
    </div>
  );
};
