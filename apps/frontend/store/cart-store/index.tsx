import { StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { PUBLIC_ENV } from "@/config/public.env.config";

import { ICartStore, ICartStoreState } from "./cart-store.type";

const createCartStoreCreator =
  (initState?: Partial<ICartStoreState>): StateCreator<ICartStore> =>
  (set, get, _store) => {
    const state: ICartStore = {
      items: [],
      loading: false,
      isOpen: false, // Mặc định là đóng
      _hasHydrated: false,
      ...initState,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setIsOpen: (isOpen) => set({ isOpen }),

      addItem: (item, quantity) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) => i.sku_id === item.sku_id,
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },

      removeItem: (sku_id) => {
        const { items } = get();
        set({ items: items.filter((i) => i.sku_id !== sku_id) });
      },

      updateQuantity: (sku_id, quantity) => {
        const { items } = get();
        const updatedItems = items.map((i) =>
          i.sku_id === sku_id ? { ...i, quantity } : i,
        );
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),
    };

    return state;
  };

export const createCartStore = (initState?: Partial<ICartStoreState>) =>
  createStore<ICartStore>()(
    devtools(
      persist(createCartStoreCreator(initState), {
        name: "CartStore",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }),
      {
        name: "CartStore",
        enabled: PUBLIC_ENV.IS_DEBUG,
      },
    ),
  );
