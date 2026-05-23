"use client";

import Button from "@/components/atoms/button";
import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import { XIcon } from "@/components/atoms/icons";
import { AddressesForm } from "@/components/molecules/addresses-form";
import { AddressFormInput } from "@/components/molecules/addresses-form/addresses.schema";
import {
  TAddress,
  TCreateAddressInput,
} from "@/domain/addresses/types/address.model";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("ProfileAddressesPage");
  const tCommon = useTranslations("Common.modal");
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

  const title = editingAddress ? t("editAddress") : t("newAddress");
  return (
    <AppDialog isOpen={isOpen} onClose={onClose}>
      <AppDialogPanel className="bg-surface/95 border-content/10 relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border shadow-2xl backdrop-blur-3xl">
        <div className="border-content/5 bg-surface/50 flex items-center justify-between border-b px-10 py-8 backdrop-blur-xl">
          <div>
            <AppDialogTitle className="text-content text-2xl font-bold">
              {title}
            </AppDialogTitle>
            <p className="text-content/40 mt-1 text-xs">
              {t("shippingDetails")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-content/5 rounded-full transition-colors"
            aria-label={tCommon("close")}
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="hide-scrollbar max-h-[70vh] overflow-y-auto p-10">
          <AddressesForm
            onSubmit={onSubmit}
            loading={loading}
            initialData={initialData}
            key={isOpen ? editingAddress?.id || "new" : "closed"} // Reset form when modal opens with new data
          />
        </div>
      </AppDialogPanel>
    </AppDialog>
  );
};
