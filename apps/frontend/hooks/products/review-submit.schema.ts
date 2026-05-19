import { z } from "zod";

export const getReviewSubmitSchema = (t: (key: string) => string) =>
  z.object({
    rating: z.number().min(1, t("ratingRequired")).max(5, t("ratingRequired")),
    comment: z.string().trim().max(1000, t("commentMax1000")).optional(),
  });

export type ReviewSubmitSchema = z.infer<
  ReturnType<typeof getReviewSubmitSchema>
>;
