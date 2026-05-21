import { useAddressStore } from "./use-address-store";

export const useSelectedAddress = () => {
  const selectedAddressId = useAddressStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useAddressStore((s) => s.setSelectedAddressId);

  return {
    selectedAddressId,
    setSelectedAddressId,
  };
};
