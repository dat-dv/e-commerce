import { EGender } from "@/domain/auth/types/auth.model";
import { z } from "zod";

export const requireProfileInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date < new Date();
    }, "Invalid date of birth"),
  gender: z.enum(EGender, { error: "Gender is required" }),
});

export type TRequireProfileInfoSchema = z.infer<
  typeof requireProfileInfoSchema
>;
