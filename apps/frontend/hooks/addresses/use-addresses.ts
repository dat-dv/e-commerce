import { addressesUseCase } from "@/domain/addresses";
import { useCallback } from "react";
import { useAddressStore } from "./use-address-store";

export const useAddresses = () => {
  const addresses = useAddressStore((s) => s.addresses);
  const loading = useAddressStore((s) => s.loading);
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const setLoading = useAddressStore((s) => s.setLoading);
  const setHasHydrated = useAddressStore((s) => s.setHasHydrated);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await addressesUseCase.getAddresses.execute();
      if (res.status === "success") {
        setAddresses(res.data || []);
        setHasHydrated(true);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setHasHydrated(true);
    } finally {
      setLoading(false);
    }
  }, [setAddresses, setHasHydrated, setLoading]);

  return {
    addresses,
    loading,
    fetchAddresses,
  };
};
