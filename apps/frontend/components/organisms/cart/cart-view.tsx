"use client";

import React from "react";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { useCartAdapter } from "@/hooks/cart/use-cart-adapter";
import { AnimatePresence } from "framer-motion";
import CartRecommendations from "./cart-recommendations";

import { CartHeader } from "../../molecules/cart-part/cart-header";
import { CartTableHead } from "../../molecules/cart-part/cart-table-head";
import { CartItemRow } from "../../molecules/cart-part/cart-item-row";
import { CartFooter } from "../../molecules/cart-part/cart-footer";
import { EmptyCart } from "../../molecules/cart-part/empty-cart";

export default function CartView() {
  const {
    items,
    selectedSkuIds,
    totalAmount,
    isAllSelected,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelectItem,
    handleToggleSelectAll,
    handleDeleteSelected,
    clearCart,
  } = useCartAdapter();

  const _hasHydrated = useCartStore((s) => s._hasHydrated);

  const seedDummyData = () => {
    const dummyItems = [
      {
        sku_id: "dummy-1",
        product_id: "prod-1",
        name: "COMBO 5/2 Đầu nối nhanh vòi máy giặt, PPR, ống nước cứng PVC",
        price: 15,
        image_url: "https://picsum.photos/200/200?random=1",
        attributes: "Type: 5/2 Connector",
        is_out_of_stock: true,
      },
      {
        sku_id: "dummy-2",
        product_id: "prod-2",
        name: "Flower Knows Butterfly Cloud Collar Makeup Gift Set",
        price: 85,
        image_url: "https://picsum.photos/200/200?random=2",
        attributes: "Style: Gift Set 6",
      },
      {
        sku_id: "dummy-3",
        product_id: "prod-3",
        name: "Maono PD100X RGB USB/XLR Dynamic Gaming Microphone",
        price: 120,
        image_url: "https://picsum.photos/200/200?random=3",
        attributes: "Color: Black RGB",
      },
    ];

    dummyItems.forEach((item) => {
      // @ts-expect-error - Dummy items for UI demo have extra fields
      addItem(item, 1);
    });
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
