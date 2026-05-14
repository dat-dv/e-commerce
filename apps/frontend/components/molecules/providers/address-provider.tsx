"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { useStore } from "zustand";

import { createAddressStore } from "@/store/address-store";
import { IAddressStoreState } from "@/store/address-store/address-store.type";
import { addressesUseCase } from "@/domain/addresses";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

export type AddressStore = ReturnType<typeof createAddressStore>;
export const AddressContext = createContext<AddressStore | null>(null);

export interface AddressProviderProps {
  children: ReactNode;
  initState?: Partial<IAddressStoreState>;
}

export const AddressProvider = ({
  children,
  initState,
}: AddressProviderProps) => {
  const [store] = useState(() =>
    createAddressStore({
      ...initState,
      _hasHydrated: initState ? true : false,
    }),
  );
  const hasHydrated = useStore(store, (s) => s._hasHydrated);

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const getAddresses = async () => {
      const res = await addressesUseCase.getAddresses.execute();
      const initialAddresses = res?.data || [];
      const setAddresses = store.getState().setAddresses;
      const setHasHydrated = store.getState().setHasHydrated;
      setAddresses(initialAddresses);
      setHasHydrated(true);
    };

    if (!hasHydrated) getAddresses();
  }, [store, hasHydrated, user]);

  return (
    <AddressContext.Provider value={store}>{children}</AddressContext.Provider>
  );
};
