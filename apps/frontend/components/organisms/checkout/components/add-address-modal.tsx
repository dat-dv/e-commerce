"use client";

import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AddressesForm } from "@/components/molecules/addresses-form";
import {
  TAddress,
  TCreateAddressInput,
} from "@/domain/addresses/types/address.model";
import { XIcon } from "@/components/atoms/icons";
import Button from "@/components/atoms/button";
import { AddressFormInput } from "@/components/molecules/addresses-form/addresses.schema";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TCreateAddressInput) => Promise<boolean>;
  loading: boolean;
  editingAddress?: TAddress | null;
}

export const AddAddressModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  editingAddress,
}: AddAddressModalProps) => {
  const initialData: Partial<AddressFormInput> | undefined = editingAddress
    ? {
        receiverName: editingAddress.name,
        receiverPhone: (() => {
          const phone = editingAddress.phone || "";
          const country = [
            { dialCode: "+84" },
            { dialCode: "+66" },
            { dialCode: "+65" },
            { dialCode: "+60" },
            { dialCode: "+62" },
            { dialCode: "+63" },
            { dialCode: "+673" },
            { dialCode: "+855" },
            { dialCode: "+856" },
            { dialCode: "+95" },
          ].find((c) => phone.startsWith(c.dialCode));

          if (country) {
            return {
              phoneCode: country.dialCode,
              phoneNumber: phone.slice(country.dialCode.length),
            };
          }
          return { phoneCode: "+84", phoneNumber: phone };
        })(),
        label: editingAddress.label,
        state: editingAddress.province,
        city: editingAddress.district,
        street: editingAddress.street,
        country: editingAddress.country,
        postalCode: editingAddress.postalCode,
        latitude: editingAddress.latitude,
        longitude: editingAddress.longitude,
        isDefault: editingAddress.isDefault,
      }
    : undefined;

  const title = editingAddress ? "Edit Address" : "New Address";
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
      <div
        className="fixed inset-0 bg-content/40 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-2xl bg-surface/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-content/10 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          <div className="px-10 py-8 border-b border-content/5 flex justify-between items-center bg-surface/50 backdrop-blur-xl">
            <div>
              <DialogTitle className="text-2xl font-bold text-content">
                {title}
              </DialogTitle>
              <p className="text-xs text-content/40 mt-1">Shipping Details</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-content/5 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-10 max-h-[70vh] overflow-y-auto hide-scrollbar">
            <AddressesForm
              onSubmit={onSubmit}
              loading={loading}
              initialData={initialData}
              key={isOpen ? editingAddress?.id || "new" : "closed"} // Reset form when modal opens with new data
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
