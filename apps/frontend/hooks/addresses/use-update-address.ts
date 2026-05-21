import { toast } from "@/components/ui/toast";
import { addressesUseCase } from "@/domain/addresses";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAddressStore } from "./use-address-store";

export const useUpdateAddress = () => {
  const t = useTranslations("ProfileAddressesPage.toast");
  const [updating, setUpdating] = useState(false);
  const setAddresses = useAddressStore((s) => s.setAddresses);

  const updateAddress = async (
    id: string,
    data: Partial<TCreateAddressInput>,
  ): Promise<boolean> => {
    setUpdating(true);
    try {
      const res = await addressesUseCase.updateAddress.execute(id, data);
      if (res.status === "success") {
        const listRes = await addressesUseCase.getAddresses.execute();
        if (listRes.status === "success") {
          setAddresses(listRes.data || []);
        }
        toast.success(t("updateSuccess"));
        return true;
      }
      throw new Error(res.message);
    } catch {
      toast.error(t("updateFailed"));
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateAddress,
    updating,
  };
};
