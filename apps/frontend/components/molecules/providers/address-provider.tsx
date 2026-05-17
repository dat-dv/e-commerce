"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { useStore } from "zustand";

import { createAddressStore } from "@/store/address-store";
import { addressesUseCase } from "@/domain/addresses";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { TAddress } from "@/domain/addresses/types/address.model";

export type AddressStore = ReturnType<typeof createAddressStore>;
export const AddressContext = createContext<AddressStore | null>(null);

export interface AddressProviderProps {
  children: ReactNode;
  initState?: TAddress[];
}

export const AddressProvider = ({
  children,
  initState,
}: AddressProviderProps) => {
  const [store] = useState(() =>
    createAddressStore({
      addresses: initState || [],
      hasHydrated: initState ? true : false,
    }),
  );
  const hasHydrated = useStore(store, (s) => s.hasHydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user || hasHydrated) return;
    const getAddresses = async () => {
      const res = await addressesUseCase.getAddresses.execute();
      const initialAddresses = res?.data || [];
      const setAddresses = store.getState().setAddresses;
      const setHasHydrated = store.getState().setHasHydrated;
      setAddresses(initialAddresses);
      setHasHydrated(true);
    };

    getAddresses();
  }, [store, user, hasHydrated]);

  return (
    <AddressContext.Provider value={store}>{children}</AddressContext.Provider>
  );
};
