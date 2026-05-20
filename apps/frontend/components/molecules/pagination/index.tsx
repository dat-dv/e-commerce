"use client";

import { cn } from "@/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
          ? "z-10 bg-primary text-white shadow-lg shadow-primary/25 sm:scale-110"
          : "border border-white/5 bg-white/5 text-content/40 hover:bg-white/10 hover:text-content active:scale-90",
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
  const t = useTranslations("Common.pagination");
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const label = direction === "left" ? t("previous") : t("next");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-content/10 bg-white/5 text-content/60 transition-colors hover:bg-white/10 hover:text-content disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10 sm:rounded-xl",
        !disabled && "active:scale-90",
      )}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
    </button>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  queryParam?: string;
  scroll?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  queryParam,
  scroll = false,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const handlePageSelect = (page: number) => {
    if (queryParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(queryParam, page.toString());

      router.push(`${pathname}?${params.toString()}`, { scroll });
      return;
    }

    onPageChange?.(page);
  };

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex w-full items-center justify-center gap-1.5 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500 sm:gap-4"
    >
      <PaginationArrow
        direction="left"
        disabled={currentPage === 1}
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
        onClick={() => handlePageSelect(Math.min(totalPages, currentPage + 1))}
      />
    </nav>
  );
};
