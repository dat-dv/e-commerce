"use client";

import Button from "@/components/atoms/button";
import AppForm from "@/components/molecules/form/app-form";
import { ReviewSubmitSchema } from "@/hooks/products/review-submit.schema";
import { APP_ROUTES } from "@/constants/routes";
import { Star } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

interface ReviewSubmitFormProps {
  methods: UseFormReturn<ReviewSubmitSchema>;
  isAuthenticated: boolean;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (data: ReviewSubmitSchema) => void | Promise<void>;
}

export const ReviewSubmitForm = ({
  methods,
  isAuthenticated,
  isSubmitting,
  error,
  onSubmit,
}: ReviewSubmitFormProps) => {
  return (
    <div className="rounded-2xl border border-content/[0.05] bg-background/40 p-5">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-base font-bold text-content">Write a review</h3>
        <p className="text-sm text-content/55">
          Reviews are available after a delivered purchase.
        </p>
      </div>

      {isAuthenticated ? (
        <AppForm methods={methods} onSubmit={onSubmit} className="space-y-4">
          <Controller
            name="rating"
            control={methods.control}
            render={({ field, fieldState: { error: fieldError } }) => (
              <div>
                <div
                  className="flex gap-1"
                  role="radiogroup"
                  aria-label="Rating"
                >
                  {[1, 2, 3, 4, 5].map((rating) => {
                    const isActive = rating <= field.value;

                    return (
                      <button
                        key={rating}
                        type="button"
                        role="radio"
                        aria-checked={field.value === rating}
                        aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                        className="rounded-lg p-1 text-amber-400 outline-none transition-colors hover:bg-amber-400/10 focus-visible:ring-2 focus-visible:ring-primary/50"
                        onClick={() => field.onChange(rating)}
                      >
                        <Star
                          className="size-6"
                          fill={isActive ? "currentColor" : "none"}
                          aria-hidden
                        />
                      </button>
                    );
                  })}
                </div>
                {fieldError?.message && (
                  <p className="mt-1 text-xs font-bold text-red-500">
                    {fieldError.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="comment"
            control={methods.control}
            render={({ field, fieldState: { error: fieldError } }) => (
              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-sm font-bold text-content/80"
                >
                  Comment
                </label>
                <textarea
                  {...field}
                  id="review-comment"
                  rows={4}
                  maxLength={1000}
                  placeholder="Share what stood out after using this product."
                  className="min-h-28 w-full resize-y rounded-xl border-2 border-content/5 bg-surface px-4 py-3 text-sm shadow-sm outline-none transition-colors placeholder:text-content/35 focus:border-primary"
                />
                <div className="mt-1 flex justify-between gap-3 text-xs font-bold text-content/35">
                  <span className="text-red-500">{fieldError?.message}</span>
                  <span>{String(field.value ?? "").length}/1000</span>
                </div>
              </div>
            )}
          />

          {error && (
            <p role="alert" className="text-sm font-semibold text-red-500">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="w-full rounded-xl sm:w-auto"
          >
            Submit Review
          </Button>
        </AppForm>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-content/60">
            Sign in to review delivered purchases.
          </p>
          <Button
            href={APP_ROUTES.SIGN_IN}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
};
