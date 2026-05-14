import { useCartStore } from "../use-cart-store";
import { useCallback, useMemo } from "react";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { useAddToCart } from "../use-add-to-cart";
import { useRemoveFromCart } from "../use-remove-from-cart";
import { useUpdateCartQuantity } from "../use-update-cart-quantity";
import { useClearCart } from "../use-clear-cart";
import { useLoadCart } from "../use-load-cart";

export const useCartAdapter = () => {
  const items = useCartStore((s) => s.items);
  const selectedSkuIds = useCartStore((s) => s.selectedSkuIds);
  const isOpen = useCartStore((s) => s.isOpen);
  const toggleSelectItem = useCartStore((s) => s.toggleSelectItem);
  const selectAll = useCartStore((s) => s.selectAll);
  const clearSelection = useCartStore((s) => s.clearSelection);
  const setIsOpen = useCartStore((s) => s.setIsOpen);

  const _addItem = useAddToCart();
  const { removeItem: _removeItem, removeItems: _removeItems } =
    useRemoveFromCart();
  const _updateQuantity = useUpdateCartQuantity();
  const _clearCart = useClearCart();
  const loadCart = useLoadCart();

  const addItem = useCallback(
    async (item: Omit<TCartItem, "quantity">, quantity: number) => {
      await _addItem(item, quantity);
    },
    [_addItem],
  );

  const removeItem = useCallback(
    async (sku_id: string) => {
      const item = items.find((i) => i.sku_id === sku_id);
      if (!item) return;
      await _removeItem(item);
    },
    [items, _removeItem],
  );

  const updateQuantity = useCallback(
    async (sku_id: string, quantity: number) => {
      const item = items.find((i) => i.sku_id === sku_id);
      if (!item) return;
      await _updateQuantity(item, quantity);
    },
    [items, _updateQuantity],
  );

  const clearCart = useCallback(async () => {
    await _clearCart(items);
  }, [_clearCart, items]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedSkuIds.includes(item.sku_id)),
    [items, selectedSkuIds],
  );

  const totalAmount = useMemo(
    () =>
      selectedItems.reduce(
        (acc, item) => acc + (item.price || 0) * item.quantity,
        0,
      ),
    [selectedItems],
  );

  const itemsCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const isAllSelected = useMemo(
    () => items.length > 0 && selectedSkuIds.length === items.length,
    [items.length, selectedSkuIds.length],
  );

  const handleToggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll();
    }
  }, [isAllSelected, clearSelection, selectAll]);

  const handleDeleteSelected = useCallback(async () => {
    if (isAllSelected) {
      await _clearCart(items);
    } else {
      await _removeItems(selectedItems);
    }
    clearSelection();
  }, [
    isAllSelected,
    _clearCart,
    _removeItems,
    items,
    selectedItems,
    clearSelection,
  ]);

  const subtotal = useMemo(
    () =>
      items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0),
    [items],
  );

  return {
    items,
    selectedSkuIds,
    selectedItems,
    totalAmount,
    subtotal,
    itemsCount,
    isAllSelected,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleSelectItem,
    selectAll,
    clearSelection,
    handleToggleSelectAll,
    handleDeleteSelected,
    setIsOpen,
    loadCart,
  };
};
