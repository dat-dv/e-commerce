import { useTranslations } from "next-intl";
import { z } from "zod";

/**
 * Generates the validation schema for password resets.
 *
 * @param t - The translation key lookup function
 */

type K = ReturnType<typeof useTranslations>;

export const getResetPasswordSchema = (t: K) =>
  z
    .object({
      password: z.string().min(8, t("passwordMin8")),
      confirmPassword: z.string().min(8, t("passwordMin8")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });

export type TResetPasswordSchema = z.infer<
  ReturnType<typeof getResetPasswordSchema>
>;
