import { toast } from "@/components/ui/toast";
import { addressesUseCase } from "@/domain/addresses";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAddressStore } from "./use-address-store";

export const useAddAddress = () => {
  const t = useTranslations("ProfileAddressesPage.toast");
  const [adding, setAdding] = useState(false);
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const setSelectedAddressId = useAddressStore((s) => s.setSelectedAddressId);

  const addAddress = async (data: TCreateAddressInput): Promise<boolean> => {
    setAdding(true);
    try {
      const res = await addressesUseCase.createAddress.execute(data);
      if (res.status === "success" && res.data) {
        const listRes = await addressesUseCase.getAddresses.execute();
        if (listRes.status === "success") {
          setAddresses(listRes.data || []);
        }
        setSelectedAddressId(res.data.id);
        toast.success(t("addSuccess"));
        return true;
      }
      throw new Error(res.message);
    } catch {
      toast.error(t("addFailed"));
      return false;
    } finally {
      setAdding(false);
    }
  };

  return {
    addAddress,
    adding,
  };
};
