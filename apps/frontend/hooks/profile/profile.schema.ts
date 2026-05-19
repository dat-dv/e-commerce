import { EGender } from "@ecommerce/shared";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { dummyTranslator } from "@/utils/i18n";

type K = ReturnType<typeof useTranslations>;

const aseanCodes = [
  "+84",
  "+65",
  "+60",
  "+66",
  "+63",
  "+62",
  "+673",
  "+855",
  "+856",
  "+95",
];

export const getPhoneSchema = (t: K) =>
  z
    .object({
      phoneCode: z
        .string()
        .min(1, t("phoneCodeRequired"))
        .regex(/^\+\d{1,4}$/, t("phoneCodeInvalid")),

      phoneNumber: z
        .string()
        .min(7, t("phoneNumberRequired"))
        .max(11, t("phoneNumberTooLong"))
        .regex(/^\d+$/, t("phoneNumberDigitsOnly")),
    })
    .refine(
      (data) => {
        if (
          aseanCodes.includes(data.phoneCode) &&
          data.phoneNumber.startsWith("0")
        ) {
          return false;
        }
        return true;
      },
      {
        message: t("phoneNumberStartsWithZero"),
        path: ["phoneNumber"],
      },
    );

export const getProfileSchema = (t: K) =>
  z.object({
    firstName: z.string().min(1, { message: t("firstNameRequired") }),
    lastName: z.string().min(1, { message: t("lastNameRequired") }),
    email: z
      .string()
      .email({ message: t("emailInvalid") })
      .optional(),
    dateOfBirth: z.string().datetime().optional().nullable(),
    avatarUrl: z
      .string()
      .url({ message: t("avatarUrlInvalid") })
      .optional()
      .or(z.literal("")),
    avatarId: z.string().optional().nullable(),
    gender: z.nativeEnum(EGender).optional().nullable(),
    phone: getPhoneSchema(t),
  });

export const phoneSchema = getPhoneSchema(dummyTranslator);
export const profileSchema = getProfileSchema(dummyTranslator);

export type ProfileSchema = z.infer<ReturnType<typeof getProfileSchema>>;
