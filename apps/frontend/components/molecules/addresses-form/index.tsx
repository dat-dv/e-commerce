"use client";

import { Plus } from "lucide-react";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import AppForm from "@/components/molecules/form/app-form";
import Button from "@/components/atoms/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  AddressFormData,
  AddressFormInput,
} from "./addresses.schema";
import {
  EShippingAddressLabels,
  SHIPPING_ADDRESS_LABELS_OPTIONS,
} from "@/constants/shipping-address.constanst";
import { FormMapPicker } from "../form/form-map-picker";

interface AddressesFormProps {
  onSubmit: (data: AddressFormData) => Promise<boolean>;
  loading: boolean;
}

export const AddressesForm = ({ onSubmit, loading }: AddressesFormProps) => {
  const methods = useForm<AddressFormInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: EShippingAddressLabels.HOME,
      receiver_name: "",
      receiver_phone: "",
      latitude: 0,
      longitude: 0,
      street: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      is_default: false,
    },
  });

  const receiverName = methods.watch("receiver_name");
  const receiverPhone = methods.watch("receiver_phone");
  const isRecipientFilled = !!receiverName && !!receiverPhone;

  const handleFormSubmit = async (data: AddressFormData) => {
    const success = await onSubmit(data);
    if (success) {
      methods.reset();
    }
  };

  return (
    <AppForm methods={methods} onSubmit={handleFormSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="receiver_name"
            label="Receiver Name"
            placeholder="John Doe"
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
          <FormPhoneInput
            name="receiver_phone"
            label="Receiver Phone"
            disabled={loading}
            className="h-10 text-sm rounded-xl"
          />
        </div>

        <FormSelect
          name="label"
          label="Label"
          options={SHIPPING_ADDRESS_LABELS_OPTIONS}
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <FormMapPicker
          label="Address from Map"
          nameLat="latitude"
          nameLng="longitude"
          disabled={!isRecipientFilled || loading}
        />

        <FormInput
          name="street"
          label="Street / Specific Details"
          placeholder="e.g., House No. 12, Floor 3, Street Name"
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={!isRecipientFilled || loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="city"
            label="City"
            placeholder="City"
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={!isRecipientFilled || loading}
          />
          <FormInput
            name="state"
            label="State / Province"
            placeholder="State"
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="country"
            label="Country"
            placeholder="Country"
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
          <FormInput
            name="postal_code"
            label="Postal Code"
            placeholder="Postal Code"
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_default"
            {...methods.register("is_default")}
            className="rounded border-content/20 text-primary focus:ring-primary"
            disabled={loading}
          />
          <label htmlFor="is_default" className="text-sm text-content/80">
            Set as default address
          </label>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="flex items-center justify-center gap-2 w-full mt-6"
        >
          <Plus size={18} />
          Add Address
        </Button>
      </div>
    </AppForm>
  );
};
