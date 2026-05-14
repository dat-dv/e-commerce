import { StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { PUBLIC_ENV } from "@/config/public.env.config";

import { TCartItem, TCartStore, TCartStoreState } from "./cart-store.type";

const computeCartDerived = (items: TCartItem[], selectedSkuIds: string[]) => {
  const selectedItems = items.filter((i) => selectedSkuIds.includes(i.sku_id));
  const totalAmount = selectedItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0,
  );
  const subtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0,
  );
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAllSelected =
    items.length > 0 && selectedSkuIds.length === items.length;

  return {
    selectedItems,
    totalAmount,
    subtotal,
    itemsCount,
    isAllSelected,
  };
};

const createCartStoreCreator =
  (initState?: Partial<TCartStoreState>): StateCreator<TCartStore> =>
  (set, get, _store) => {
    const initialItems = initState?.items || [];
    const initialSelectedIds = initState?.selectedSkuIds || [];

    const state: TCartStore = {
      items: initialItems,
      selectedSkuIds: initialSelectedIds,
      loading: false,
      isOpen: false,
      _hasHydrated: false,
      ...initState,
      ...computeCartDerived(initialItems, initialSelectedIds),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setLoading: (loading) => set({ loading }),
      setIsOpen: (isOpen) => set({ isOpen }),

      addItem: (item, quantity) => {
        const { items, selectedSkuIds } = get();
        const existingItemIndex = items.findIndex(
          (i) => i.sku_id === item.sku_id,
        );

        let newItems = [...items];
        let newSelectedIds = [...selectedSkuIds];

        if (existingItemIndex !== -1) {
          newItems[existingItemIndex].quantity += quantity;
        } else {
          newItems = [...items, { ...item, quantity }];
          newSelectedIds = [...selectedSkuIds, item.sku_id];
        }

        set({
          items: newItems,
          selectedSkuIds: newSelectedIds,
          ...computeCartDerived(newItems, newSelectedIds),
        });
      },

      removeItem: (sku_id) => {
        const { items, selectedSkuIds } = get();
        const newItems = items.filter((i) => i.sku_id !== sku_id);
        const newSelectedIds = selectedSkuIds.filter((id) => id !== sku_id);

        set({
          items: newItems,
          selectedSkuIds: newSelectedIds,
          ...computeCartDerived(newItems, newSelectedIds),
        });
      },

      updateQuantity: (sku_id, quantity) => {
        const { items, selectedSkuIds } = get();
        const newItems = items.map((i) =>
          i.sku_id === sku_id ? { ...i, quantity } : i,
        );
        set({
          items: newItems,
          ...computeCartDerived(newItems, selectedSkuIds),
        });
      },

      setItems: (items) => {
        const { selectedSkuIds } = get();
        set({
          items,
          ...computeCartDerived(items, selectedSkuIds),
        });
      },

      clearCart: () =>
        set({
          items: [],
          selectedSkuIds: [],
          ...computeCartDerived([], []),
        }),

      toggleSelectItem: (sku_id) => {
        const { items, selectedSkuIds } = get();
        const next = selectedSkuIds.includes(sku_id)
          ? selectedSkuIds.filter((id) => id !== sku_id)
          : [...selectedSkuIds, sku_id];

        set({
          selectedSkuIds: next,
          ...computeCartDerived(items, next),
        });
      },

      selectItems: (sku_ids) => {
        const { items } = get();
        set({
          selectedSkuIds: sku_ids,
          ...computeCartDerived(items, sku_ids),
        });
      },

      selectAll: () => {
        const { items } = get();
        const next = items.map((i) => i.sku_id);
        set({
          selectedSkuIds: next,
          ...computeCartDerived(items, next),
        });
      },

      clearSelection: () => {
        const { items } = get();
        set({
          selectedSkuIds: [],
          ...computeCartDerived(items, []),
        });
      },
      deleteOrUpdateItem: (item, quantity) => {
        const { items, selectedSkuIds } = get();
        const newItems = [...items];
        let newSelectedIds = [...selectedSkuIds];

        const existingItemIndex = newItems.findIndex(
          (i) => i.sku_id === item.sku_id,
        );

        if (existingItemIndex !== -1) {
          if (quantity <= 0) {
            newItems.splice(existingItemIndex, 1);
            newSelectedIds = newSelectedIds.filter((id) => id !== item.sku_id);
          } else {
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity,
            };
          }
        } else if (quantity > 0) {
          newItems.push({ ...item, quantity });
          newSelectedIds.push(item.sku_id);
        }

        set({
          items: newItems,
          selectedSkuIds: newSelectedIds,
          ...computeCartDerived(newItems, newSelectedIds),
        });
      },
    };

    return state;
  };

export const createCartStore = (initState?: Partial<TCartStoreState>) =>
  createStore<TCartStore>()(
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
