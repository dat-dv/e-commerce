import { z } from "zod";

export const timeSlotFormSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    startHour: z.number().int().min(0).max(23),
    startMinute: z.number().int().min(0).max(59),
    endHour: z.number().int().min(0).max(23),
    endMinute: z.number().int().min(0).max(59),
    isActive: z.boolean(),
  })
  .refine(
    (value) =>
      value.endHour * 60 + value.endMinute >
      value.startHour * 60 + value.startMinute,
    {
      path: ["endHour"],
      message: "End time must be after start time.",
    },
  );

export type TimeSlotFormData = z.infer<typeof timeSlotFormSchema>;
