import { z } from "zod";

export const getRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z
        .string()
        .min(1, { message: t("emailRequired") })
        .email({ message: t("emailInvalid") }),
      password: z.string().min(6, { message: t("passwordMin6") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("confirmPasswordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });

export type RegisterSchema = z.infer<ReturnType<typeof getRegisterSchema>>;
