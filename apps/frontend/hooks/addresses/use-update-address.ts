import { addressesUseCase } from "@/domain/addresses";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { useTranslations } from "next-intl";
import { useCallback, useTransition } from "react";
import { useAddressStore } from "./use-address-store";

export const useUpdateAddress = () => {
  const t = useTranslations("ProfileAddressesPage.toast");
  const [isPending, startTransition] = useTransition();
  const setAddresses = useAddressStore((s) => s.setAddresses);

  const updateAddress = useCallback(
    (id: string, data: Partial<TCreateAddressInput>): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
          try {
            const res = await addressesUseCase.updateAddress.execute(id, data);
            if (res.status === "success") {
              const listRes = await addressesUseCase.getAddresses.execute();
              if (listRes.status === "success") {
                setAddresses(listRes.data || []);
              }
              // toast.success(t("updateSuccess"));
              resolve(true);
              return;
            }
            throw new Error(res.message);
          } catch {
            // toast.error(t("updateFailed"));
            resolve(false);
          }
        });
      });
    },
    [setAddresses],
  );

  return {
    updateAddress,
    updating: isPending,
  };
};
