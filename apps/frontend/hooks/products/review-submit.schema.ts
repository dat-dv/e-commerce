import { z } from "zod";

export const reviewSubmitSchema = z.object({
  rating: z.number().min(1, "Choose a rating").max(5, "Choose a rating"),
  comment: z
    .string()
    .trim()
    .max(1000, "Review must be 1000 characters or less")
    .optional(),
});

export type ReviewSubmitSchema = z.infer<typeof reviewSubmitSchema>;
