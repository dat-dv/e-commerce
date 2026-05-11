import { z } from "zod";

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
});

export type ProfileSchema = z.infer<typeof profileSchema>;
