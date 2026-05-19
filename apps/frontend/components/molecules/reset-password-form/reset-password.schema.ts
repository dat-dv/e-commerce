import { z } from "zod";

export const getResetPasswordSchema = (t: (key: string) => string) =>
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
