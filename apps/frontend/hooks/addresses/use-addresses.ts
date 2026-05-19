import { useCallback, useEffect } from "react";
import { useAddressStore } from "./use-address-store";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { toast } from "react-toastify";
import { addressesUseCase } from "@/domain/addresses";

export const useAddresses = () => {
  const addresses = useAddressStore((s) => s.addresses);
  const loading = useAddressStore((s) => s.loading);
  const hasHydrated = useAddressStore((s) => s.hasHydrated);
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const setLoading = useAddressStore((s) => s.setLoading);
  const setHasHydrated = useAddressStore((s) => s.setHasHydrated);
  const selectedAddressId = useAddressStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useAddressStore((s) => s.setSelectedAddressId);

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

  const addAddress = async (data: TCreateAddressInput) => {
    try {
      const res = await addressesUseCase.createAddress.execute(data);
      if (res.status === "success" && res.data) {
        toast.success("Address added successfully");
        await fetchAddresses();
        setSelectedAddressId(res.data.id);
        return true;
      }
      toast.error(res.message || "Failed to add address");
      return false;
    } catch {
      toast.error("An error occurred while adding address");
      return false;
    }
  };

  const updateAddress = async (
    id: string,
    data: Partial<TCreateAddressInput>,
  ) => {
    try {
      const res = await addressesUseCase.updateAddress.execute(id, data);
      if (res.status === "success") {
        toast.success("Address updated successfully");
        await fetchAddresses();
        return true;
      }
      toast.error(res.message || "Failed to update address");
      return false;
    } catch {
      toast.error("An error occurred while updating address");
      return false;
    }
  };

  useEffect(() => {
    if (!hasHydrated && !loading) {
      fetchAddresses();
      return;
    }

    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [
    addresses,
    fetchAddresses,
    hasHydrated,
    loading,
    selectedAddressId,
    setSelectedAddressId,
  ]);

  return {
    addresses,
    loading,
    selectedAddressId,
    setSelectedAddressId,
    fetchAddresses,
    addAddress,
    updateAddress,
  };
};
