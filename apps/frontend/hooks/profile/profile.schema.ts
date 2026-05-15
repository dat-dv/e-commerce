import { z } from "zod";
import { EGender } from "@/domain/auth/types/auth.model";

export const profileSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  dob: z
    .string()
    .datetime({ message: "Invalid date format (must be ISO string)" })
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  gender: z.nativeEnum(EGender).optional().nullable(),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\+\d{1,4}\d{7,11}$/, { message: "Invalid phone number format" })
    .refine(
      (val) => {
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
        const matchedCode = aseanCodes.find((code) => val.startsWith(code));
        if (matchedCode) {
          const rest = val.slice(matchedCode.length);
          return !rest.startsWith("0");
        }
        return true;
      },
      { message: "Phone number should not start with 0 after country code" },
    ),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
