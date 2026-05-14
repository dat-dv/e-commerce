import { useContext } from "react";
import { useStore } from "zustand";

import { AddressContext } from "@/components/molecules/providers/address-provider";
import { IAddressStore } from "@/store/address-store/address-store.type";

export const useAddressStore = <T>(
  selector: (state: IAddressStore) => T,
): T => {
  const store = useContext(AddressContext);
  if (!store) {
    throw new Error("useAddressStore must be used within AddressProvider");
  }
  return useStore(store, selector);
};
