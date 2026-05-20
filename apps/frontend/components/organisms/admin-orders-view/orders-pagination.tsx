"use client";

import Button from "@/components/atoms/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function OrdersPagination({
  page,
  totalPages,
  loading,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const t = useTranslations("AdminOrdersPage.results");
  return (
    <nav
      aria-label={t("paginationAria")}
      className="flex flex-col gap-3 border-t border-content/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-content/55">
        {t("showingPageOf", {
          page: String(page),
          totalPages: String(totalPages),
        })}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          aria-label={t("previousPage")}
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-content/15 text-content hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40 h-auto p-0 active:scale-95 opacity-100 hover:opacity-100"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Button>

        <div className="flex max-w-[calc(100vw-8rem)] items-center gap-1 overflow-x-auto">
          {Array.from({ length: totalPages }, (_, index) => {
            const targetPage = index + 1;
            const isCurrent = page === targetPage;

            return (
              <Button
                key={targetPage}
                type="button"
                variant="ghost"
                aria-label={t("pageAria", { page: String(targetPage) })}
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => onPageChange(targetPage)}
                disabled={loading}
                className={
                  isCurrent
                    ? "inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 h-auto p-0 opacity-100 hover:opacity-100 hover:bg-primary active:scale-95"
                    : "inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-content/15 text-sm font-semibold text-content/70 hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40 h-auto p-0 opacity-100 hover:opacity-100 active:scale-95"
                }
              >
                {targetPage}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="ghost"
          aria-label={t("nextPage")}
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-content/15 text-content hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40 h-auto p-0 active:scale-95 opacity-100 hover:opacity-100"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
