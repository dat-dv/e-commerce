import { addressesUseCase } from "@/domain/addresses";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { useCallback, useTransition } from "react";
import { useAddressStore } from "./use-address-store";

export const useUpdateAddress = () => {
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
              resolve(true);
              return;
            }
            throw new Error(res.message);
          } catch {
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
