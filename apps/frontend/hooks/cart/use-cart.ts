import { useCallback } from "react";
import { useCartStore } from "./use-cart-store";

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const selectedSkuIds = useCartStore((s) => s.selectedSkuIds);
  const isOpen = useCartStore((s) => s.isOpen);
  const setIsOpen = useCartStore((s) => s.setIsOpen);
  const toggleSelectItem = useCartStore((s) => s.toggleSelectItem);
  const selectAll = useCartStore((s) => s.selectAll);
  const clearSelection = useCartStore((s) => s.clearSelection);

  const selectedItems = useCartStore((s) => s.selectedItems);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const subtotal = useCartStore((s) => s.subtotal);
  const itemsCount = useCartStore((s) => s.itemsCount);
  const isAllSelected = useCartStore((s) => s.isAllSelected);

  const handleToggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll();
    }
  }, [isAllSelected, clearSelection, selectAll]);

  return {
    items,
    selectedSkuIds,
    selectedItems,
    totalAmount,
    subtotal,
    itemsCount,
    isAllSelected,
    isOpen,
    setIsOpen,
    toggleSelectItem,
    selectAll,
    clearSelection,
    handleToggleSelectAll,
  };
};
