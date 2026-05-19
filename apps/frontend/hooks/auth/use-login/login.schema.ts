import { z } from "zod";

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("emailInvalid") }),
    password: z.string().min(6, { message: t("passwordMin6") }),
  });

export type LoginSchema = z.infer<ReturnType<typeof getLoginSchema>>;
