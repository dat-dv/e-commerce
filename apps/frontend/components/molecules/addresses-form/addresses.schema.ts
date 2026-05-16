import { EAddressLabel } from "@ecommerce/shared";
import * as z from "zod";

export const addressSchema = z.object({
  label: z.nativeEnum(EAddressLabel, {
    error: "Label is required",
  }),
  receiverName: z.string().min(1, "Receiver name is required"),
  receiverPhone: z.object({
    phoneCode: z.string(),
    phoneNumber: z.string().min(1, "Receiver phone is required"),
  }),
  latitude: z.number().refine((val) => val !== 0, "Map location is required"),
  longitude: z.number().refine((val) => val !== 0, "Map location is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type AddressFormInput = z.input<typeof addressSchema>;
