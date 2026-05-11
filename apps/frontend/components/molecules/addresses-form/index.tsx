"use client";

import React, { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import AppForm from "@/components/molecules/form/app-form";
import Button from "@/components/atoms/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormData } from "./addresses.schema";
import MapPickerModal from "@/components/molecules/profile-form/map-picker-modal";
import { cn } from "@/utils/cn";

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
  const [mapOpen, setMapOpen] = useState(false);

  const methods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      receiverName: "",
      receiverPhone: "",
      detailAddress: "",
      specificDetails: "",
      isDefault: false,
    },
  });

  const handlePickAddress = (address: string) => {
    methods.setValue("detailAddress", address, { shouldDirty: true });
  };

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

        <div className="space-y-2">
          <label className="text-sm font-medium text-content">Address from Map</label>
          <div
            onClick={() => !loading && setMapOpen(true)}
            className={cn(
              "p-3 border rounded-xl cursor-pointer flex justify-between items-center",
              methods.watch("detailAddress") ? "border-primary/20 bg-primary/5" : "border-content/10 bg-white",
              loading && "cursor-not-allowed opacity-50"
            )}
          >
            <div className="flex items-center gap-2 max-w-[80%]">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className={cn("text-sm truncate", !methods.watch("detailAddress") && "text-content/40")}>
                {methods.watch("detailAddress") || "Click to pick address on map"}
              </span>
            </div>
            <span className="text-xs text-primary font-medium">
              {methods.watch("detailAddress") ? "Change" : "Select"}
            </span>
          </div>
        </div>

        <FormInput
          name="specificDetails"
          label="Specific Details (House number, building, floor...)"
          placeholder="e.g., House No. 12, Floor 3"
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

      <MapPickerModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onPick={handlePickAddress}
      />
    </AppForm>
  );
};
