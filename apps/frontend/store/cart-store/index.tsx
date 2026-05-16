import { StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { PUBLIC_ENV } from "@/config/public.env.config";

import { TCartItem, TCartStore, TCartStoreState } from "./cart-store.type";

const computeCartDerived = (items: TCartItem[], selectedSkuIds: string[]) => {
  const selectedItems = items.filter((i) => selectedSkuIds.includes(i.skuId));
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
          (i) => i.skuId === item.skuId,
        );

        let newItems = [...items];
        let newSelectedIds = [...selectedSkuIds];

        if (existingItemIndex !== -1) {
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity,
          };

          if (newItems[existingItemIndex].quantity <= 0) {
            newItems.splice(existingItemIndex, 1);
            newSelectedIds = newSelectedIds.filter((id) => id !== item.skuId);
          }
        } else if (quantity > 0) {
          newItems = [...items, { ...item, quantity }];
          newSelectedIds = [...selectedSkuIds, item.skuId];
        }

        set({
          items: newItems,
          selectedSkuIds: newSelectedIds,
          ...computeCartDerived(newItems, newSelectedIds),
        });
      },

      removeItem: (skuId) => {
        const { items, selectedSkuIds } = get();
        const newItems = items.filter((i) => i.skuId !== skuId);
        const newSelectedIds = selectedSkuIds.filter((id) => id !== skuId);

        set({
          items: newItems,
          selectedSkuIds: newSelectedIds,
          ...computeCartDerived(newItems, newSelectedIds),
        });
      },

      updateQuantity: (skuId, quantity) => {
        const { items, selectedSkuIds } = get();
        const newItems = items.map((i) =>
          i.skuId === skuId ? { ...i, quantity } : i,
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

      toggleSelectItem: (skuId) => {
        const { items, selectedSkuIds } = get();
        const next = selectedSkuIds.includes(skuId)
          ? selectedSkuIds.filter((id) => id !== skuId)
          : [...selectedSkuIds, skuId];

        set({
          selectedSkuIds: next,
          ...computeCartDerived(items, next),
        });
      },

      selectItems: (skuIds) => {
        const { items } = get();
        set({
          selectedSkuIds: skuIds,
          ...computeCartDerived(items, skuIds),
        });
      },

      selectAll: () => {
        const { items } = get();
        const next = items.map((i) => i.skuId);
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
      addOrUpdateItem: (item, quantity) => {
        const { items, selectedSkuIds } = get();
        const newItems = [...items];
        let newSelectedIds = [...selectedSkuIds];

        const existingItemIndex = newItems.findIndex(
          (i) => i.skuId === item.skuId,
        );

        if (existingItemIndex !== -1) {
          if (quantity <= 0) {
            newItems.splice(existingItemIndex, 1);
            newSelectedIds = newSelectedIds.filter((id) => id !== item.skuId);
          } else {
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              ...item,
              quantity,
            };
          }
        } else if (quantity > 0) {
          newItems.push({ ...item, quantity });
          newSelectedIds.push(item.skuId);
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
