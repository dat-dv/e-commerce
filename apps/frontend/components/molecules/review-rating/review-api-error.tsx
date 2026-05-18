"use client";

import Button from "@/components/atoms/button";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ReviewApiErrorProps {
  message: string;
  onRetry: () => void;
}

export const ReviewApiError = ({ message, onRetry }: ReviewApiErrorProps) => {
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
            <h3 className="text-sm font-bold text-content">
              Reviews could not be loaded
            </h3>
            <p className="mt-1 text-sm text-content/60">{message}</p>
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
          Retry
        </Button>
      </div>
    </div>
  );
};
