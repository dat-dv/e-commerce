import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
