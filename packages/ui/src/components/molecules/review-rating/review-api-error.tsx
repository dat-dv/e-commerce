"use client";

import Button from "@/components/atoms/button";
import { AlertCircle, RotateCcw } from "lucide-react";

import { useTranslations } from "next-intl";

interface ReviewApiErrorProps {
  message: string;
  onRetry: () => void;
}

export const ReviewApiError = ({ message, onRetry }: ReviewApiErrorProps) => {
  const t = useTranslations("ProductDetailPage");
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-500/15 bg-red-500/5 px-5 py-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <AlertCircle
            className="mt-0.5 size-5 shrink-0 text-red-500"
            aria-hidden
          />
          <div className="min-w-0">
            <h3 className="text-content text-sm font-bold">
              {t("reviewsLoadFailed")}
            </h3>
            <p className="text-content/60 mt-1 text-sm">{message}</p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="shrink-0 rounded-lg"
        >
          <RotateCcw className="size-4" aria-hidden />
          {t("retry")}
        </Button>
      </div>
    </div>
  );
};
