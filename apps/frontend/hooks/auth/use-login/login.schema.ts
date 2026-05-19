import { useTranslations } from "next-intl";
import { z } from "zod";

type K = ReturnType<typeof useTranslations>;

/**
 * Generates the validation schema for user login.
 *
 * @param t - The translation key lookup function
 */
export const getLoginSchema = (t: K) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("emailInvalid") }),
    password: z.string().min(6, { message: t("passwordMin6") }),
  });

export type LoginSchema = z.infer<ReturnType<typeof getLoginSchema>>;
