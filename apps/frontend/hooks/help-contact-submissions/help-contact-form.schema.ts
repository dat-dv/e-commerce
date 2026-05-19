import { z } from "zod";

export const getHelpContactFormSchema = (t: (key: string) => string) =>
  z
    .object({
      contact_name: z.string().max(120, t("contactNameMax")),
      contact_email: z
        .string()
        .trim()
        .email(t("emailInvalid"))
        .or(z.literal("")),
      contact_phone: z.object({
        phoneCode: z.string(),
        phoneNumber: z.string().trim(),
      }),
      subject: z
        .string()
        .trim()
        .min(1, t("subjectRequired"))
        .max(160, t("subjectMax")),
      message: z
        .string()
        .trim()
        .min(1, t("messageRequired"))
        .max(5000, t("messageMax")),
    })
    .refine((data) => data.contact_email || data.contact_phone.phoneNumber, {
      message: t("emailOrPhoneRequired"),
      path: ["contact_email"],
    });

export const helpContactFormSchema = getHelpContactFormSchema((key) => key);

export type HelpContactFormData = z.infer<
  ReturnType<typeof getHelpContactFormSchema>
>;
