"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import { addressesUseCase } from "@/domain/addresses";
import { TAddress } from "@/domain/addresses/types/address.model";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { createAddressStore } from "@/store/address-store";
import { safe } from "@/utils/promise";

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
  const getDefaultAddressId = (addresses: TAddress[]) => {
    const defaultAddr = addresses.find((addr) => addr.isDefault);
    return defaultAddr?.id || addresses[0]?.id || null;
  };
  const [store] = useState(() =>
    createAddressStore({
      addresses: initState || [],
      hasHydrated: initState ? true : false,
      selectedAddressId: getDefaultAddressId(initState || []),
    }),
  );
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const hydrate = store.getState().hasHydrated;
    if (hydrate || !user) return;
    const getAddresses = async () => {
      const res = await safe(addressesUseCase.getAddresses.execute());
      const initialAddresses = res?.data || [];
      const setAddresses = store.getState().setAddresses;
      const setHasHydrated = store.getState().setHasHydrated;
      const setSelectedAddressId = store.getState().setSelectedAddressId;
      const defaultAddrId = getDefaultAddressId(initialAddresses);
      setSelectedAddressId(defaultAddrId);
      setAddresses(initialAddresses);
      setHasHydrated(true);
    };

    getAddresses();
  }, [store, user]);

  return (
    <AddressContext.Provider value={store}>{children}</AddressContext.Provider>
  );
};
