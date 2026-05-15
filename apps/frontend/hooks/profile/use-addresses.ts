"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { addressesUseCase } from "@/domain/addresses";
import {
  TAddress,
  TCreateAddressInput,
} from "@/domain/addresses/types/address.model";

export type { TAddress as Address };

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<TAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await addressesUseCase.getAddresses.execute();
      if (response.status === "success" && response.data) {
        setAddresses(response.data);
      }
    } catch {
      toast.error("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (data: TCreateAddressInput): Promise<boolean> => {
    setAdding(true);
    try {
      const response = await addressesUseCase.createAddress.execute(data);
      if (response.status === "success") {
        await fetchAddresses();
        toast.success("Address added successfully!");
        return true;
      }
      throw new Error(response.message);
    } catch {
      toast.error("Failed to add address.");
      return false;
    } finally {
      setAdding(false);
    }
  };

  const deleteAddress = async (id: string) => {
    setMutatingId(id);
    try {
      const response = await addressesUseCase.deleteAddress.execute(id);
      if (response.status === "success") {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Address removed.");
      } else {
        throw new Error(response.message);
      }
    } catch {
      toast.error("Failed to delete address.");
    } finally {
      setMutatingId(null);
    }
  };

  const setDefaultAddress = async (id: string) => {
    setMutatingId(id);
    try {
      const response = await addressesUseCase.setDefaultAddress.execute(id);
      if (response.status === "success") {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: a.id === id })),
        );
        toast.success("Default address updated.");
      } else {
        throw new Error(response.message);
      }
    } catch {
      toast.error("Failed to set default address.");
    } finally {
      setMutatingId(null);
    }
  };

  return {
    addresses,
    loading,
    adding,
    mutatingId,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    refresh: fetchAddresses,
  };
};
