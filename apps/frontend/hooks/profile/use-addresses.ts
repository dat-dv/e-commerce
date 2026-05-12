import { useState } from "react";
import { toast } from "react-toastify";

export interface Address {
  id: string;
  label: string;
  receiverName: string;
  receiverPhone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  detailAddress: string;
  isDefault: boolean;
}

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const addAddress = async (newAddress: Omit<Address, "id">) => {
    setAdding(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const addressWithId = {
        ...newAddress,
        id: Math.random().toString(36).substr(2, 9),
      };

      if (addressWithId.isDefault) {
        setAddresses(
          addresses
            .map((a) => ({ ...a, isDefault: false }))
            .concat(addressWithId),
        );
      } else {
        setAddresses([...addresses, addressWithId]);
      }

      toast.success("Address added successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to add address.");
      return false;
    } finally {
      setAdding(false);
    }
  };

  const deleteAddress = async (id: string) => {
    setDeletingId(id);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAddresses(addresses.filter((addr) => addr.id !== id));
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address.");
    } finally {
      setDeletingId(null);
    }
  };

  const setDefaultAddress = async (id: string) => {
    setSettingDefaultId(id);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        })),
      );
      toast.success("Default address updated!");
    } catch (error) {
      toast.error("Failed to update default address.");
    } finally {
      setSettingDefaultId(null);
    }
  };

  return {
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    adding,
    deletingId,
    settingDefaultId,
    loading: adding || !!deletingId || !!settingDefaultId,
  };
};
