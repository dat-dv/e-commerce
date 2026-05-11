import * as z from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required (e.g., Home, Office)"),
  receiverName: z.string().min(1, "Receiver name is required"),
  receiverPhone: z.string().min(1, "Receiver phone is required"),
  detailAddress: z.string().min(1, "Detail address is required"),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
