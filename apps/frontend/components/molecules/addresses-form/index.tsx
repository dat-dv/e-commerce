"use client";

import Button from "@/components/atoms/button";
import AppForm from "@/components/molecules/form/app-form";
import { FormCheckbox } from "@/components/molecules/form/form-checkbox";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { EAddressLabel } from "@ecommerce/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormMapPicker } from "../form/form-map-picker";
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
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="receiverName"
            label={t("receiverNameLabel")}
            placeholder={t("receiverNamePlaceholder")}
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
          <FormPhoneInput
            name="receiverPhone"
            label={t("receiverPhoneLabel")}
            disabled={loading}
            className="h-10 text-sm rounded-xl"
          />
        </div>

        <FormSelect
          name="label"
          label={t("labelField")}
          options={translatedLabelOptions}
          variant="outline"
          className="h-10 text-sm rounded-xl"
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
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="city"
            label={t("cityLabel")}
            placeholder={t("cityPlaceholder")}
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
          <FormInput
            name="state"
            label={t("stateLabel")}
            placeholder={t("statePlaceholder")}
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="country"
            label={t("countryLabel")}
            placeholder={t("countryPlaceholder")}
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
          <FormInput
            name="postalCode"
            label={t("postalCodeLabel")}
            placeholder={t("postalCodePlaceholder")}
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
        </div>

        <FormCheckbox name="isDefault">
          <span className="text-sm text-content/80">
            {t("setDefaultCheckbox")}
          </span>
        </FormCheckbox>

        <Button
          type="submit"
          loading={loading}
          className="flex items-center justify-center gap-2 w-full mt-6"
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
