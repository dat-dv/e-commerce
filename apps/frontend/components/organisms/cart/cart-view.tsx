"use client";

import React, { useMemo } from "react";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { AnimatePresence } from "framer-motion";
import CartRecommendations from "./cart-recommendations";

import { CartHeader } from "../../molecules/cart-part/cart-header";
import { CartTableHead } from "../../molecules/cart-part/cart-table-head";
import { CartItemRow } from "../../molecules/cart-part/cart-item-row";
import { CartFooter } from "../../molecules/cart-part/cart-footer";
import { EmptyCart } from "../../molecules/cart-part/empty-cart";

export default function CartView() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const _hasHydrated = useCartStore((s) => s._hasHydrated);

  const selectedSkuIds = useCartStore((s) => s.selectedSkuIds);
  const toggleSelectItem = useCartStore((s) => s.toggleSelectItem);
  const selectAll = useCartStore((s) => s.selectAll);
  const clearSelection = useCartStore((s) => s.clearSelection);

  const seedDummyData = () => {
    const dummyItems = [
      {
        sku_id: "dummy-1",
        product_id: "prod-1",
        name: "COMBO 5/2 Đầu nối nhanh vòi máy giặt, PPR, ống nước cứng PVC",
        price: 0,
        image_url: "https://picsum.photos/200/200?random=1",
        attributes: "Loại: 5/2 Đầu nối",
        is_out_of_stock: true,
      },
      {
        sku_id: "dummy-2",
        product_id: "prod-2",
        name: "Bộ quà tặng trang điểm nhỏ Flower Knows Butterfly Cloud Collar",
        price: 858000,
        image_url: "https://picsum.photos/200/200?random=2",
        attributes: "Phân loại: Bộ quà tặng 6",
      },
      {
        sku_id: "dummy-3",
        product_id: "prod-3",
        name: "Bộ micrô chơi game năng động Maono PD100X RGB USB/XLR",
        price: 909000,
        image_url: "https://picsum.photos/200/200?random=3",
        attributes: "Màu: Đen RGB",
      },
    ];

    dummyItems.forEach((item) => {
      // @ts-expect-error - Dummy items for UI demo have extra fields
      addItem(item, 1);
    });
  };

  const selectedItems = useMemo(
    () => items.filter((item) => selectedSkuIds.includes(item.sku_id)),
    [items, selectedSkuIds],
  );

  const totalAmount = useMemo(
    () =>
      selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [selectedItems],
  );

  const isAllSelected =
    items.length > 0 && selectedSkuIds.length === items.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  const handleDeleteSelected = () => {
    if (isAllSelected) {
      clearCart();
    } else {
      selectedSkuIds.forEach((id) => removeItem(id));
    }
  };

  if (!_hasHydrated) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[50vh] flex items-center justify-center">
        <div className="text-content/40">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <CartHeader itemCount={items.length} />

      {items.length === 0 ? (
        <div className="space-y-12">
          <EmptyCart onSeedDummy={seedDummyData} />
          <CartRecommendations />
        </div>
      ) : (
        <div className="space-y-6 pb-32">
          <CartTableHead
            isAllSelected={isAllSelected}
            onToggleSelectAll={handleToggleSelectAll}
          />

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemRow
                  key={item.sku_id}
                  item={item}
                  isSelected={selectedSkuIds.includes(item.sku_id)}
                  onToggleSelect={() => toggleSelectItem(item.sku_id)}
                  onRemove={() => removeItem(item.sku_id)}
                  onUpdateQuantity={(val) => updateQuantity(item.sku_id, val)}
                />
              ))}
            </AnimatePresence>
          </div>

          <CartFooter
            itemCount={items.length}
            selectedCount={selectedSkuIds.length}
            totalAmount={totalAmount}
            isAllSelected={isAllSelected}
            onToggleSelectAll={handleToggleSelectAll}
            onDeleteSelected={handleDeleteSelected}
          />

          <CartRecommendations />
        </div>
      )}
    </div>
  );
}
