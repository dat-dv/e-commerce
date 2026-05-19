import { z } from "zod";

export const getOrderReturnRequestSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(4, t("returnReasonMin"))
      .max(120, t("returnReasonMax")),
    description: z
      .string()
      .trim()
      .min(12, t("returnDescriptionMin"))
      .max(1200, t("returnDescriptionMax")),
  });

export const orderReturnRequestSchema = getOrderReturnRequestSchema(
  (key) => key,
);

export type OrderReturnRequestFormData = z.infer<
  typeof orderReturnRequestSchema
>;
