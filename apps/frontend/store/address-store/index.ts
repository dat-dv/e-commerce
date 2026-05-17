import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { PUBLIC_ENV } from "@/config/public.env.config";
import { IAddressStore, IAddressStoreState } from "./address-store.type";

const createAddressStoreCreator =
  (initState?: Partial<IAddressStoreState>): StateCreator<IAddressStore> =>
  (set, get) => ({
    addresses: [],
    selectedAddressId: null,
    loading: false,
    hasHydrated: false,
    ...initState,

    setHasHydrated: (state) => set({ hasHydrated: state }),
    setAddresses: (addresses) => {
      const { selectedAddressId } = get();
      const newState: Partial<IAddressStore> = { addresses };

      if (!selectedAddressId && addresses.length > 0) {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        newState.selectedAddressId = defaultAddr.id;
      }

      set(newState);
    },
    setSelectedAddressId: (id) => set({ selectedAddressId: id }),
    setLoading: (loading) => set({ loading }),

    getSelectedAddress: () => {
      const { addresses, selectedAddressId } = get();
      return addresses.find((a) => a.id === selectedAddressId);
    },
    resetStore: () =>
      set({
        addresses: [],
        selectedAddressId: null,
        loading: false,
        hasHydrated: false,
      }),
  });

export const createAddressStore = (initState?: Partial<IAddressStoreState>) =>
  createStore<IAddressStore>()(
    devtools(createAddressStoreCreator(initState), {
      name: "AddressStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
