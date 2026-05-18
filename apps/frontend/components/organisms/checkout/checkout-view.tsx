"use client";

import React from "react";
import { useCheckoutAdapter } from "@/hooks/checkout/use-checkout-adapter";
import { useCreateAddress } from "@/hooks/addresses/use-create-address";
import { CheckoutHeader } from "./checkout-header";
import { ShippingSection } from "./shipping-section";
import { CheckoutList } from "./checkout-list-section";
import { OrderSummary } from "./order-summary";
import { AddAddressModal } from "../../molecules/add-address-modal";
import { TAddress } from "@/domain/addresses/types/address.model";

export const CheckoutView = () => {
  const {
    selectedItems,
    totalAmount,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    loading: loadingAddresses,
    placingOrder,
    handlePlaceOrder,
    handleSubmitAddress,
  } = useCheckoutAdapter();

  const {
    isOpen: isAddModalOpen,
    isSubmitting: isAddingAddress,
    open: openAddModal,
    openEdit,
    close: closeAddModal,
    handleSubmit: onAddAddressSubmit,
    editingAddress,
  } = useCreateAddress({
    onSubmit: handleSubmitAddress,
  });

  const onClickEdit = (address: TAddress) => {
    openEdit(address);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <CheckoutHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-16">
          <ShippingSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            loading={loadingAddresses}
            onAddAddress={openAddModal}
            onClickEdit={onClickEdit}
          />

          <CheckoutList items={selectedItems} />
        </div>

        <OrderSummary
          totalAmount={totalAmount}
          onPlaceOrder={handlePlaceOrder}
          loading={placingOrder}
          isItemsEmpty={selectedItems.length === 0}
          recipientName={
            addresses.find((a) => a.id === selectedAddressId)?.name
          }
          recipientPhone={
            addresses.find((a) => a.id === selectedAddressId)?.phone
          }
        />
      </div>

      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={onAddAddressSubmit}
        loading={isAddingAddress}
        editingAddress={editingAddress}
      />
    </div>
  );
};
