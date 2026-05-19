import { useTranslations } from "next-intl";
import { z } from "zod";

type K = ReturnType<typeof useTranslations>;

/**
 * Generates the validation schema for retrieving forgotten passwords.
 *
 * @param t - The translation key lookup function
 */
export const getForgotPasswordSchema = (t: K) =>
  z
    .object({
      email: z.string().email(t("emailInvalid")).optional().or(z.literal("")),
      phone: z.string().min(10, t("phoneMin10")).optional().or(z.literal("")),
    })
    .refine((data) => data.email || data.phone, {
      message: t("emailOrPhoneRequired"),
      path: ["email"],
    });

export type TForgotPasswordSchema = z.infer<
  ReturnType<typeof getForgotPasswordSchema>
>;
