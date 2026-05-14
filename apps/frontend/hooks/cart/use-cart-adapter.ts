import { useCallback, useMemo } from "react";
import { useCartStore } from "./use-cart-store";

export const useCartAdapter = () => {
  const items = useCartStore((s) => s.items);
  const selectedSkuIds = useCartStore((s) => s.selectedSkuIds);
  const isOpen = useCartStore((s) => s.isOpen);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const toggleSelectItem = useCartStore((s) => s.toggleSelectItem);
  const selectAll = useCartStore((s) => s.selectAll);
  const clearSelection = useCartStore((s) => s.clearSelection);
  const setIsOpen = useCartStore((s) => s.setIsOpen);

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

  const handleDeleteSelected = useCallback(() => {
    if (isAllSelected) {
      clearCart();
    } else {
      selectedSkuIds.forEach((id) => removeItem(id));
    }
  }, [isAllSelected, clearCart, selectedSkuIds, removeItem]);

  return {
    items,
    selectedSkuIds,
    selectedItems,
    totalAmount,
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
  };
};
