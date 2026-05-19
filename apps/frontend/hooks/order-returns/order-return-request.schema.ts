import { useTranslations } from "next-intl";
import { z } from "zod";
import { dummyTranslator } from "@/utils/i18n";

type K = ReturnType<typeof useTranslations>;

/**
 * Generates the validation schema for order return requests.
 *
 * @param t - The translation key lookup function
 */
export const getOrderReturnRequestSchema = (t: K) =>
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

export const orderReturnRequestSchema =
  getOrderReturnRequestSchema(dummyTranslator);

export type OrderReturnRequestFormData = z.infer<
  typeof orderReturnRequestSchema
>;
