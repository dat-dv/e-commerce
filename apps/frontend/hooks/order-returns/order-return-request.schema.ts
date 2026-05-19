import { z } from "zod";

export const orderReturnRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, "Enter a short reason.")
    .max(120, "Keep the reason under 120 characters."),
  description: z
    .string()
    .trim()
    .min(12, "Describe what happened.")
    .max(1200, "Keep the description under 1200 characters."),
});

export type OrderReturnRequestFormData = z.infer<
  typeof orderReturnRequestSchema
>;
