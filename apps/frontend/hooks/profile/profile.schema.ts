import { z } from "zod";
import { EGender } from "@/domain/auth/types/auth.model";

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

export const phoneSchema = z
  .object({
    phoneCode: z
      .string()
      .min(1, "Phone code is required")
      .regex(/^\+\d{1,4}$/, "Invalid country code"),

    phoneNumber: z
      .string()
      .min(7, "Phone number is required")
      .max(11, "Phone number is too long")
      .regex(/^\d+$/, "Phone number must contain only digits"),
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
      message: "Phone number should not start with 0 after country code",
      path: ["phoneNumber"],
    },
  );

export const profileSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  dob: z.string().datetime().optional().nullable(),
  avatarUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  gender: z.nativeEnum(EGender).optional().nullable(),
  phone: phoneSchema,
});

export type ProfileSchema = z.infer<typeof profileSchema>;
