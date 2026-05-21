"use client";

import Button from "@/components/atoms/button";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
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
      className="border-content/10 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-content/55 text-sm">
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
          className={cn(
            UI_RADIUS.control,
            "border-content/15 text-content hover:bg-content/5 focus-visible:ring-primary/40 inline-flex size-10 h-auto items-center justify-center border p-0 opacity-100 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
          )}
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
                className={cn(
                  UI_RADIUS.control,
                  isCurrent
                    ? "bg-primary focus-visible:ring-primary/40 hover:bg-primary inline-flex size-10 h-auto shrink-0 items-center justify-center p-0 text-sm font-semibold text-white opacity-100 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
                    : "border-content/15 text-content/70 hover:bg-content/5 focus-visible:ring-primary/40 inline-flex size-10 h-auto shrink-0 items-center justify-center border p-0 text-sm font-semibold opacity-100 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
                )}
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
          className={cn(
            UI_RADIUS.control,
            "border-content/15 text-content hover:bg-content/5 focus-visible:ring-primary/40 inline-flex size-10 h-auto items-center justify-center border p-0 opacity-100 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
