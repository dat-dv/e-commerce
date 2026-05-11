"use client";

import React from "react";
import { Plus } from "lucide-react";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import AppForm from "@/components/molecules/form/app-form";
import Button from "@/components/atoms/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormData } from "./addresses.schema";

const labelOptions = [
  { label: "Home (Nhà riêng)", value: "Home" },
  { label: "Office (Công ty)", value: "Office" },
  { label: "Other (Khác)", value: "Other" },
];

interface AddressesFormProps {
  onSubmit: (data: AddressFormData) => Promise<boolean>;
  loading: boolean;
}

export const AddressesForm = ({ onSubmit, loading }: AddressesFormProps) => {
  const methods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      receiverName: "",
      receiverPhone: "",
      detailAddress: "",
      isDefault: false,
    },
  });

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
            name="receiverName"
            label="Receiver Name"
            placeholder="John Doe"
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
          <FormInput
            name="receiverPhone"
            label="Receiver Phone"
            placeholder="0123456789"
            variant="outline"
            className="h-10 text-sm rounded-xl"
            disabled={loading}
          />
        </div>

        <FormSelect
          name="label"
          label="Label"
          options={labelOptions}
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <FormInput
          name="detailAddress"
          label="Detail Address"
          placeholder="123 Street, Ward 4..."
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            {...methods.register("isDefault")}
            className="rounded border-content/20 text-primary focus:ring-primary"
            disabled={loading}
          />
          <label htmlFor="isDefault" className="text-sm text-content/80">
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
