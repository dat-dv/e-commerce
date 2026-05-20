import { aseanCountries } from "@/constants/countries";
import { dummyTranslator } from "@/utils/i18n";
import { EGender } from "@ecommerce/shared";
import { useTranslations } from "next-intl";
import { z } from "zod";

type K = ReturnType<typeof useTranslations>;

const aseanCodes = aseanCountries.map((country) => country.dialCode);

export const getPhoneSchema = (t: K) =>
  z
    .object({
      phoneCode: z.string().optional().or(z.literal("")),
      phoneNumber: z.string().optional().or(z.literal("")),
    })
    .superRefine((data, ctx) => {
      if (!data.phoneCode && !data.phoneNumber) {
        return;
      }

      if (!data.phoneCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("phoneCodeRequired"),
          path: ["phoneCode"],
        });
      } else if (!/^\+\d{1,4}$/.test(data.phoneCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("phoneCodeInvalid"),
          path: ["phoneCode"],
        });
      }

      if (!data.phoneNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("phoneNumberRequired"),
          path: ["phoneNumber"],
        });
      } else {
        if (!/^\d+$/.test(data.phoneNumber)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("phoneNumberDigitsOnly"),
            path: ["phoneNumber"],
          });
        }
        if (data.phoneNumber.length < 7) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("phoneNumberRequired"),
            path: ["phoneNumber"],
          });
        }
        if (data.phoneNumber.length > 11) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("phoneNumberTooLong"),
            path: ["phoneNumber"],
          });
        }
      }

      if (data.phoneCode && data.phoneNumber) {
        if (
          aseanCodes.includes(data.phoneCode) &&
          data.phoneNumber.startsWith("0")
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("phoneNumberStartsWithZero"),
            path: ["phoneNumber"],
          });
        }
      }
    });

export const getProfileSchema = (t: K) =>
  z.object({
    firstName: z.string().min(1, { message: t("firstNameRequired") }),
    lastName: z.string().min(1, { message: t("lastNameRequired") }),
    email: z
      .string()
      .email({ message: t("emailInvalid") })
      .optional()
      .or(z.literal("")),
    dateOfBirth: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        { message: t("dateOfBirthInvalid") },
      ),
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
