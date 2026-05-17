import { z } from "zod";

export const helpContactFormSchema = z
  .object({
    contact_name: z.string().max(120, "Name must be at most 120 characters"),
    contact_email: z
      .string()
      .trim()
      .email("Invalid email address")
      .or(z.literal("")),
    contact_phone: z.object({
      phoneCode: z.string(),
      phoneNumber: z.string().trim(),
    }),
    subject: z
      .string()
      .trim()
      .min(1, "Subject is required")
      .max(160, "Subject must be at most 160 characters"),
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(5000, "Message must be at most 5000 characters"),
  })
  .refine((data) => data.contact_email || data.contact_phone.phoneNumber, {
    message: "Email or phone is required",
    path: ["contact_email"],
  });

export type HelpContactFormData = z.infer<typeof helpContactFormSchema>;
