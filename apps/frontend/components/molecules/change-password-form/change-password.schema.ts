import { useTranslations } from "next-intl";
import * as z from "zod";
import { dummyTranslator } from "@/utils/i18n";

type K = ReturnType<typeof useTranslations>;

/**
 * Generates the validation schema for updating the user's password.
 *
 * @param t - The translation key lookup function
 */
export const getChangePasswordSchema = (t: K) =>
  z
    .object({
      currentPassword: z.string().min(1, t("currentPasswordRequired")),
      newPassword: z.string().min(6, t("newPasswordMin6")),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });

export const changePasswordSchema = getChangePasswordSchema(dummyTranslator);

export type ChangePasswordFormData = z.infer<
  ReturnType<typeof getChangePasswordSchema>
>;
