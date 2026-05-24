import { z } from "zod";

export const timeSlotFormSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    startHour: z
      .union([z.number(), z.string()])
      .refine(
        (val) => Number(val) >= 0 && Number(val) <= 23,
        "Hour must be between 0 and 23",
      ),
    startMinute: z
      .union([z.number(), z.string()])
      .refine(
        (val) => Number(val) >= 0 && Number(val) <= 59,
        "Minute must be between 0 and 59",
      ),
    endHour: z
      .union([z.number(), z.string()])
      .refine(
        (val) => Number(val) >= 0 && Number(val) <= 23,
        "Hour must be between 0 and 23",
      ),
    endMinute: z
      .union([z.number(), z.string()])
      .refine(
        (val) => Number(val) >= 0 && Number(val) <= 59,
        "Minute must be between 0 and 59",
      ),
    isActive: z.boolean(),
  })
  .refine(
    (value) =>
      Number(value.endHour) * 60 + Number(value.endMinute) >
      Number(value.startHour) * 60 + Number(value.startMinute),
    {
      path: ["endHour"],
      message: "End time must be after start time.",
    },
  );

export type TimeSlotFormData = z.infer<typeof timeSlotFormSchema>;
