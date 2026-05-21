import { toast } from "@/components/ui/toast";
import { addressesUseCase } from "@/domain/addresses";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAddressStore } from "./use-address-store";

export const useSetDefaultAddress = () => {
  const t = useTranslations("ProfileAddressesPage.toast");
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const addresses = useAddressStore((s) => s.addresses);
  const setAddresses = useAddressStore((s) => s.setAddresses);

  const setDefaultAddress = async (id: string): Promise<boolean> => {
    setSettingDefaultId(id);
    try {
      const res = await addressesUseCase.setDefaultAddress.execute(id);
      if (res.status === "success") {
        setAddresses(
          addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
          })),
        );
        toast.success(t("setDefaultSuccess"));
        return true;
      }
      throw new Error(res.message);
    } catch {
      toast.error(t("setDefaultFailed"));
      return false;
    } finally {
      setSettingDefaultId(null);
    }
  };

  return {
    setDefaultAddress,
    settingDefaultId,
  };
};
