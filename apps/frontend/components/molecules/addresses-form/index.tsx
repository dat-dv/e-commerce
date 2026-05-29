"use client";

import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { EAddressLabel } from "@ecommerce/shared";
import {
  AppForm,
  Button,
  FormCheckbox,
  FormInput,
  FormPhoneInput,
  FormSelect,
} from "@ecommerce/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormMapPicker } from "../map-picker-form";
import { AddressFormData, getAddressSchema } from "./addresses.schema";

interface AddressesFormProps {
  onSubmit: (data: TCreateAddressInput) => Promise<boolean>;
  loading: boolean;
  initialData?: Partial<AddressFormData>;
}

export const AddressesForm = ({
  onSubmit,
  loading,
  initialData,
}: AddressesFormProps) => {
  const t = useTranslations("ProfileAddressesPage.form");
  const tValidation = useTranslations("Validation");

  const schema = useMemo(() => getAddressSchema(tValidation), [tValidation]);
  const methods = useForm<AddressFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: initialData?.label ?? EAddressLabel.HOME,
      receiverName: initialData?.receiverName || "",
      receiverPhone: initialData?.receiverPhone || {
        phoneCode: "+84",
        phoneNumber: "",
      },
      latitude: initialData?.latitude || 0,
      longitude: initialData?.longitude || 0,
      street: initialData?.street || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "Vietnam",
      postalCode: initialData?.postalCode || "",
      isDefault: initialData?.isDefault ?? false,
    },
  });

  const translatedLabelOptions = useMemo(
    () => [
      { label: t("labels.home"), value: EAddressLabel.HOME },
      { label: t("labels.work"), value: EAddressLabel.OFFICE },
      { label: t("labels.apartment"), value: EAddressLabel.APARTMENT },
      { label: t("labels.other"), value: EAddressLabel.OTHER },
    ],
    [t],
  );

  const handleFormSubmit = async (data: AddressFormData) => {
    const formattedData: TCreateAddressInput = {
      ...data,
      receiverPhone: `${data.receiverPhone.phoneCode}${data.receiverPhone.phoneNumber}`,
    };

    const success = await onSubmit(formattedData);
    if (success) {
      methods.reset();
    }
  };

  return (
    <AppForm methods={methods} onSubmit={handleFormSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            name="receiverName"
            label={t("receiverNameLabel")}
            placeholder={t("receiverNamePlaceholder")}
            variant="outline"
            size="md"
            disabled={loading}
          />
          <FormPhoneInput
            name="receiverPhone"
            label={t("receiverPhoneLabel")}
            disabled={loading}
            size="md"
          />
        </div>

        <FormSelect
          name="label"
          label={t("labelField")}
          options={translatedLabelOptions}
          variant="outline"
          size="md"
          disabled={loading}
        />

        <FormMapPicker
          label={t("addressFromMap")}
          nameLat="latitude"
          nameLng="longitude"
          disabled={loading}
        />

        <FormInput
          name="street"
          label={t("streetLabel")}
          placeholder={t("streetPlaceholder")}
          variant="outline"
          size="md"
          disabled={loading}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            name="city"
            label={t("cityLabel")}
            placeholder={t("cityPlaceholder")}
            variant="outline"
            size="md"
            disabled={loading}
          />
          <FormInput
            name="state"
            label={t("stateLabel")}
            placeholder={t("statePlaceholder")}
            variant="outline"
            size="md"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            name="country"
            label={t("countryLabel")}
            placeholder={t("countryPlaceholder")}
            variant="outline"
            size="md"
            disabled={loading}
          />
          <FormInput
            name="postalCode"
            label={t("postalCodeLabel")}
            placeholder={t("postalCodePlaceholder")}
            variant="outline"
            size="md"
            disabled={loading}
          />
        </div>

        <FormCheckbox name="isDefault">
          <span className="text-content/80 text-sm">
            {t("setDefaultCheckbox")}
          </span>
        </FormCheckbox>

        <Button
          type="submit"
          loading={loading}
          className="mt-6 flex w-full items-center justify-center gap-2"
        >
          {initialData ? (
            t("submitUpdate")
          ) : (
            <>
              <Plus size={18} />
              {t("submitAdd")}
            </>
          )}
        </Button>
      </div>
    </AppForm>
  );
};
