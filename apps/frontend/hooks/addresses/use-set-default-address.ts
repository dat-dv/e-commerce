import { toast } from "@/components/ui/toast";
import { addressesUseCase } from "@/domain/addresses";
import { useTranslations } from "next-intl";
import { useCallback, useState, useTransition } from "react";
import { useAddressStore } from "./use-address-store";

export const useSetDefaultAddress = () => {
  const t = useTranslations("ProfileAddressesPage.toast");
  const [, startTransition] = useTransition();
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const addresses = useAddressStore((s) => s.addresses);
  const setAddresses = useAddressStore((s) => s.setAddresses);

  const setDefaultAddress = useCallback(
    (id: string): Promise<boolean> => {
      setSettingDefaultId(id);
      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
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
              resolve(true);
              return;
            }
            throw new Error(res.message);
          } catch {
            toast.error(t("setDefaultFailed"));
            resolve(false);
          } finally {
            setSettingDefaultId(null);
          }
        });
      });
    },
    [t, addresses, setAddresses],
  );

  return {
    setDefaultAddress,
    settingDefaultId,
  };
};
