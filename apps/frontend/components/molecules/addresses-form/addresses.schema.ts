import { EAddressLabel } from "@ecommerce/shared";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { dummyTranslator } from "@/utils/i18n";

type K = ReturnType<typeof useTranslations>;

export const getAddressSchema = (t: K) =>
  z.object({
    label: z.nativeEnum(EAddressLabel, {
      error: t("labelRequired"),
    }),
    receiverName: z.string().min(1, t("receiverNameRequired")),
    receiverPhone: z.object({
      phoneCode: z.string(),
      phoneNumber: z.string().min(1, t("receiverPhoneRequired")),
    }),
    latitude: z.number().refine((val) => val !== 0, t("mapLocationRequired")),
    longitude: z.number().refine((val) => val !== 0, t("mapLocationRequired")),
    street: z.string().min(1, t("streetRequired")),
    city: z.string().min(1, t("cityRequired")),
    state: z.string().min(1, t("stateRequired")),
    country: z.string().min(1, t("countryRequired")),
    postalCode: z.string().min(1, t("postalCodeRequired")),
    isDefault: z.boolean(),
  });

export const addressSchema = getAddressSchema(dummyTranslator);

export type AddressFormData = z.infer<ReturnType<typeof getAddressSchema>>;
export type AddressFormInput = z.input<ReturnType<typeof getAddressSchema>>;
