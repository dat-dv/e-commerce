import { EGender } from "@/domain/auth/types/auth.model";
import { z } from "zod";

export const requireProfileInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.nativeEnum(EGender, { error: "Gender is required" }),
});

export type TRequireProfileInfoSchema = z.infer<
  typeof requireProfileInfoSchema
>;
