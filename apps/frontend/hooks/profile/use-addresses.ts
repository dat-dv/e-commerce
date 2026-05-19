"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/toast";
import { addressesUseCase } from "@/domain/addresses";
import {
  TAddress,
  TCreateAddressInput,
} from "@/domain/addresses/types/address.model";
import { useTranslations } from "next-intl";

export type { TAddress as Address };

export const useAddresses = () => {
  const t = useTranslations("ProfileAddressesPage.toast");
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
      toast.error(t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
        toast.success(t("addSuccess"));
        return true;
      }
      throw new Error(response.message);
    } catch {
      toast.error(t("addFailed"));
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
        toast.success(t("deleteSuccess"));
      } else {
        throw new Error(response.message);
      }
    } catch {
      toast.error(t("deleteFailed"));
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
        toast.success(t("setDefaultSuccess"));
      } else {
        throw new Error(response.message);
      }
    } catch {
      toast.error(t("setDefaultFailed"));
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
