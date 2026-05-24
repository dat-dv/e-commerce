import { z } from "zod";

export const campaignFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    timeSlotId: z.string().optional(),
  })
  .refine(
    (value) =>
      new Date(value.endTime).getTime() > new Date(value.startTime).getTime(),
    {
      path: ["endTime"],
      message: "End time must be after start time.",
    },
  );

export type CampaignFormData = z.infer<typeof campaignFormSchema>;
