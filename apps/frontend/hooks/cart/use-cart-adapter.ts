import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { cartUseCase } from "@/domain/cart/use-cases";
import { ICartItem } from "@/store/cart-store/cart-store.type";
import { useCartStore } from "./use-cart-store";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

export const useCartAdapter = () => {
  const items = useCartStore((s) => s.items);
  const selectedSkuIds = useCartStore((s) => s.selectedSkuIds);
  const isOpen = useCartStore((s) => s.isOpen);
  const _addItem = useCartStore((s) => s.addItem);
  const _removeItem = useCartStore((s) => s.removeItem);
  const _updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const toggleSelectItem = useCartStore((s) => s.toggleSelectItem);
  const selectAll = useCartStore((s) => s.selectAll);
  const clearSelection = useCartStore((s) => s.clearSelection);
  const setIsOpen = useCartStore((s) => s.setIsOpen);
  const setLoading = useCartStore((s) => s.setLoading);
  const setItems = useCartStore((s) => s.setItems);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cartUseCase.getCart.execute();
      if (response.data) {
        setItems(response.data.items);
      }
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setItems]);

  const user = useAuthStore((s) => s.user);

  const addItem = useCallback(
    async (item: Omit<ICartItem, "quantity">, quantity: number) => {
      try {
        if (user) {
          const response = await cartUseCase.addItem.execute({
            sku_id: item.sku_id,
            quantity,
          });
          if (response.data) {
            _addItem(response.data, quantity);
            toast.success("Added to cart");
          }
        } else {
          // Local only for guests
          _addItem(item as ICartItem, quantity);
          toast.success("Added to cart (local)");
        }
      } catch (err) {
        toast.error("Failed to add to cart");
      }
    },
    [_addItem, user],
  );

  const removeItem = useCallback(
    async (sku_id: string) => {
      const item = items.find((i) => i.sku_id === sku_id);
      if (!item) return;
      try {
        if (user) {
          await cartUseCase.removeItem.execute(item.id);
        }
        _removeItem(sku_id);
      } catch (err) {
        toast.error("Failed to remove item");
      }
    },
    [items, _removeItem, user],
  );

  const updateQuantity = useCallback(
    async (sku_id: string, quantity: number) => {
      const item = items.find((i) => i.sku_id === sku_id);
      if (!item) return;
      try {
        if (user) {
          await cartUseCase.updateItem.execute({ id: item.id, quantity });
        }
        _updateQuantity(sku_id, quantity);
      } catch (err) {
        toast.error("Failed to update quantity");
      }
    },
    [items, _updateQuantity, user],
  );

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
    try {
      if (isAllSelected) {
        for (const id of selectedSkuIds) {
          const item = items.find((i) => i.sku_id === id);
          if (item) await cartUseCase.removeItem.execute(item.id);
        }
        clearCart();
      } else {
        for (const id of selectedSkuIds) {
          const item = items.find((i) => i.sku_id === id);
          if (item) await cartUseCase.removeItem.execute(item.id);
          _removeItem(id);
        }
      }
    } catch (err) {
      toast.error("Failed to delete selected items");
    }
  }, [isAllSelected, clearCart, selectedSkuIds, items, _removeItem]);

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
    loadCart,
  };
};
