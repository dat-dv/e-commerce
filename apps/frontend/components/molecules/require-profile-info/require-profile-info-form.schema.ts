import { EGender } from "@ecommerce/shared";
import { z } from "zod";

export const requireProfileInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date < new Date();
    }, "Invalid date of birth"),
  gender: z.nativeEnum(EGender, { error: "Gender is required" }),
});

export type TRequireProfileInfoSchema = z.infer<
  typeof requireProfileInfoSchema
>;
