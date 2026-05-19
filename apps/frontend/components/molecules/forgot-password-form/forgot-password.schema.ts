import { z } from "zod";

export const getForgotPasswordSchema = (t: (key: string) => string) =>
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
