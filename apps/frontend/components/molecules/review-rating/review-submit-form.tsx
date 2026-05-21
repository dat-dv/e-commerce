"use client";

import Button from "@/components/atoms/button";
import Textarea from "@/components/atoms/textarea";
import AppForm from "@/components/molecules/form/app-form";
import { ReviewSubmitSchema } from "@/hooks/products/review-submit.schema";
import { APP_ROUTES } from "@/constants/routes";
import { Star } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("ProductDetailPage");
  return (
    <div className="border-content/[0.05] bg-background/40 rounded-2xl border p-5">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-content text-base font-bold">{t("writeReview")}</h3>
        <p className="text-content/55 text-sm">{t("writeReviewDesc")}</p>
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
                  aria-label={t("ratingRequired")}
                >
                  {[1, 2, 3, 4, 5].map((rating) => {
                    const isActive = rating <= field.value;

                    return (
                      <button
                        key={rating}
                        type="button"
                        role="radio"
                        aria-checked={field.value === rating}
                        aria-label={t("filterStars", {
                          rating: String(rating),
                        })}
                        className="focus-visible:ring-primary/50 rounded-lg p-1 text-amber-400 transition-colors outline-none hover:bg-amber-400/10 focus-visible:ring-2"
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
              <Textarea
                {...field}
                id="review-comment"
                label={t("comment")}
                error={fieldError?.message}
                maxCount={1000}
                placeholder={t("commentPlaceholder")}
                className="border-content/5 bg-surface focus:border-primary min-h-28"
              />
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
            {t("submitReview")}
          </Button>
        </AppForm>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-content/60 text-sm">{t("signInToReview")}</p>
          <Button
            href={APP_ROUTES.SIGN_IN}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            {t("signIn")}
          </Button>
        </div>
      )}
    </div>
  );
};
