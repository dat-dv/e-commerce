import { toast } from "@/components/ui/toast";
import { addressesUseCase } from "@/domain/addresses";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { useTranslations } from "next-intl";
import { useCallback, useTransition } from "react";
import { useAddressStore } from "./use-address-store";

export const useAddAddress = () => {
  const t = useTranslations("ProfileAddressesPage.toast");
  const [isPending, startTransition] = useTransition();
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const setSelectedAddressId = useAddressStore((s) => s.setSelectedAddressId);

  const addAddress = useCallback(
    (data: TCreateAddressInput): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
          try {
            const res = await addressesUseCase.createAddress.execute(data);
            if (res.status === "success" && res.data) {
              const listRes = await addressesUseCase.getAddresses.execute();
              if (listRes.status === "success") {
                setAddresses(listRes.data || []);
              }
              setSelectedAddressId(res.data.id);
              toast.success(t("addSuccess"));
              resolve(true);
              return;
            }
            throw new Error(res.message);
          } catch {
            toast.error(t("addFailed"));
            resolve(false);
          }
        });
      });
    },
    [t, setAddresses, setSelectedAddressId],
  );

  return {
    addAddress,
    adding: isPending,
  };
};
