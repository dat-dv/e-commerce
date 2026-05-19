import { EGender } from "@ecommerce/shared";
import { z } from "zod";

export const getRequireProfileInfoSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, t("firstNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    dateOfBirth: z
      .string()
      .min(1, t("dateOfBirthRequired"))
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date < new Date();
      }, t("dateOfBirthInvalid")),
    gender: z.nativeEnum(EGender, { error: t("genderRequired") }),
  });

export const requireProfileInfoSchema = getRequireProfileInfoSchema(
  (key) => key,
);

export type TRequireProfileInfoSchema = z.infer<
  ReturnType<typeof getRequireProfileInfoSchema>
>;
