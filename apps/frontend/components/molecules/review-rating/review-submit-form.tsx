"use client";

import Button from "@/components/atoms/button";
import AppForm from "@/components/molecules/form/app-form";
import { ReviewSubmitSchema } from "@/hooks/products/review-submit.schema";
import { UseFormReturn } from "react-hook-form";

import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import FormRating from "../form/form-rating";
import { FormTextarea } from "../form/form-textarea";

interface ReviewSubmitFormProps {
  methods: UseFormReturn<ReviewSubmitSchema>;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (data: ReviewSubmitSchema) => void | Promise<void>;
}

export const ReviewSubmitForm = ({
  methods,
  isSubmitting,
  error,
  onSubmit,
}: ReviewSubmitFormProps) => {
  const t = useTranslations("ProductDetailPage");

  return (
    <>
      <div className="from-primary/10 pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent" />
      <div className="relative mb-5 flex items-start gap-3">
        <div
          className={cn(
            "bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center",
            UI_RADIUS.card,
          )}
        >
          ★
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-content text-lg font-black">
            {t("writeReview")}
          </h3>
          <p className="text-content/55 text-sm leading-relaxed">
            {t("writeReviewDesc")}
          </p>
        </div>
      </div>
      <AppForm
        methods={methods}
        onSubmit={onSubmit}
        className={cn("relative space-y-4", UI_RADIUS.card)}
      >
        <div
          className={cn(
            "border-content/[0.06] bg-background/60 border p-4",
            UI_RADIUS.input,
          )}
        >
          <FormRating
            name="rating"
            methods={methods}
            label={t("ratingRequired")}
            getAriaLabel={(rating) =>
              t("filterStars", {
                rating: String(rating),
              })
            }
          />
        </div>

        <FormTextarea
          name="comment"
          label={t("comment")}
          maxCount={1000}
          placeholder={t("commentPlaceholder")}
          className="border-content/[0.08] bg-background/70 focus:border-primary min-h-32"
        />

        {error && (
          <p role="alert" className="text-sm font-semibold text-red-500">
            {error}
          </p>
        )}

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
          >
            {t("submitReview")}
          </Button>
        </div>
      </AppForm>
    </>
  );
};
