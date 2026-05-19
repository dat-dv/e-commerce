import * as z from "zod";

export const getChangePasswordSchema = (t: (key: string) => string) =>
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

export const changePasswordSchema = getChangePasswordSchema((key) => key);

export type ChangePasswordFormData = z.infer<
  ReturnType<typeof getChangePasswordSchema>
>;
