import { useTranslations } from "next-intl";
import { z } from "zod";

type K = ReturnType<typeof useTranslations>;

/**
 * Generates the validation schema for submitting product reviews.
 *
 * @param t - The translation key lookup function
 */
export const getReviewSubmitSchema = (t: K) =>
  z.object({
    rating: z.number().min(1, t("ratingRequired")).max(5, t("ratingRequired")),
    comment: z.string().trim().max(1000, t("commentMax1000")).optional(),
  });

export type ReviewSubmitSchema = z.infer<
  ReturnType<typeof getReviewSubmitSchema>
>;
