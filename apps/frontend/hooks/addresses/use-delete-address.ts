import { toast } from "@/components/ui/toast";
import { addressesUseCase } from "@/domain/addresses";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAddressStore } from "./use-address-store";

export const useDeleteAddress = () => {
  const t = useTranslations("ProfileAddressesPage.toast");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const addresses = useAddressStore((s) => s.addresses);
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const selectedAddressId = useAddressStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useAddressStore((s) => s.setSelectedAddressId);

  const deleteAddress = async (id: string): Promise<boolean> => {
    setDeletingId(id);
    try {
      const res = await addressesUseCase.deleteAddress.execute(id);
      if (res.status === "success") {
        const remaining = addresses.filter((addr) => addr.id !== id);
        setAddresses(remaining);

        // If the deleted address was selected, update the selectedAddressId
        if (selectedAddressId === id) {
          const defaultAddr = remaining.find((addr) => addr.isDefault);
          setSelectedAddressId(defaultAddr?.id || remaining[0]?.id || null);
        }

        toast.success(t("deleteSuccess"));
        return true;
      }
      throw new Error(res.message);
    } catch {
      toast.error(t("deleteFailed"));
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  return {
    deleteAddress,
    deletingId,
  };
};
