"use client";

import { type ReactNode } from "react";

import { Select } from "../../atoms/select";
import { Pagination } from "../pagination";

type TableFooterProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  pageSizeLabel: ReactNode;
  pageSizeOptions: number[];
  showPageSizeSelect: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function TableFooter({
  page,
  pageSize,
  total,
  totalPages,
  pageSizeLabel,
  pageSizeOptions,
  showPageSizeSelect,
  onPageChange,
  onPageSizeChange,
}: TableFooterProps) {
  return (
    <div className="border-content/10 flex flex-col gap-3 border-t px-4 py-3 text-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="text-content/60 min-w-fit whitespace-nowrap">
          Page {page} / {totalPages} - Total {total}
        </div>

        {showPageSizeSelect && (
          <div className="text-content/70 flex min-w-fit items-center gap-2 text-xs sm:text-sm">
            <span className="whitespace-nowrap">{pageSizeLabel}</span>
            <Select
              aria-label="Rows per page"
              selectedKey={String(pageSize)}
              onSelectionChange={(key) => onPageSizeChange(Number(key))}
              options={pageSizeOptions.map((option) => ({
                label: String(option),
                value: String(option),
              }))}
              className="w-[88px]"
              size="sm"
            />
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="w-full justify-start py-0 sm:justify-end lg:w-auto"
      />
    </div>
  );
}
