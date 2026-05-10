import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" })
    .optional()
    .or(z.literal("")),
  dob: z
    .string()
    .length(8, { message: "Date of birth must be DDMMYYYY (8 digits)" })
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
