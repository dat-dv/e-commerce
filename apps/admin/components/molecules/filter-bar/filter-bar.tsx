import { SearchInput } from "@ecommerce/ui";
import { Filter, X } from "lucide-react";
import React from "react";

interface IFilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  searchPlaceholder?: string;

  // Extra filters
  children?: React.ReactNode;

  // Clear all filters action (if there are multiple filters)
  onClearFilters?: () => void;
  showClearButton?: boolean;
}

export const FilterBar = ({
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder = "Search...",
  children,
  onClearFilters,
  showClearButton = false,
}: IFilterBarProps) => {
  return (
    <div className="relative z-10 flex flex-col gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:shadow-2xl sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 lg:max-w-md">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onSearch={onSearchQueryChange}
          showSubmitButton={true}
          className="w-full"
        />
      </div>

      {(children || showClearButton) && (
        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          {children && (
            <div className="flex w-full items-center gap-3 sm:w-auto sm:border-l sm:border-[var(--border-color)] sm:pl-4">
              <Filter className="hidden h-4 w-4 text-[var(--muted)] sm:block" />
              <div className="flex flex-1 items-center gap-2">{children}</div>
            </div>
          )}

          {showClearButton && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--app-text)]"
            >
              <X className="h-3.5 w-3.5 transition-transform group-hover:scale-110 group-hover:text-red-400" />
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

FilterBar.displayName = "FilterBar";
