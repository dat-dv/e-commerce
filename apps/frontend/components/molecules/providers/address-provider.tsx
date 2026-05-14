"use client";

import { createContext, ReactNode, useState } from "react";
import { useStore } from "zustand";

import Loading from "@/components/atoms/loading";
import { createAddressStore } from "@/store/address-store";
import { IAddressStoreState } from "@/store/address-store/address-store.type";

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

  if (!hasHydrated) {
    return <Loading />;
  }

  return (
    <AddressContext.Provider value={store}>{children}</AddressContext.Provider>
  );
};
