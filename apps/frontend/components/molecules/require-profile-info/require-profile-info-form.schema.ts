import { EGender } from "@ecommerce/shared";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { dummyTranslator } from "@/utils/i18n";

type K = ReturnType<typeof useTranslations>;

export const getRequireProfileInfoSchema = (t: K) =>
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

export const requireProfileInfoSchema =
  getRequireProfileInfoSchema(dummyTranslator);

export type TRequireProfileInfoSchema = z.infer<
  ReturnType<typeof getRequireProfileInfoSchema>
>;
