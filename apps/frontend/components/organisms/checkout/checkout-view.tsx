"use client";

import AppContainer from "@/components/atoms/app-container";
import {
  TAddress,
  TCreateAddressInput,
} from "@/domain/addresses/types/address.model";
import { useAddresses } from "@/hooks/addresses/use-addresses";
import { useCheckout } from "@/hooks/checkout/use-checkout";
import { useState } from "react";
import { AddAddressModal } from "../../molecules/add-address-modal";
import { CheckoutHeader } from "./checkout-header";
import { CheckoutList } from "./checkout-list-section";
import { OrderSummary } from "./order-summary";
import { ShippingSection } from "./shipping-section";

export const CheckoutView = () => {
  const {
    addresses,
    loading: loadingAddresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    updateAddress,
  } = useAddresses();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<TAddress | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const openAddModal = () => {
    setEditingAddress(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (address: TAddress) => {
    setEditingAddress(address);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingAddress(null);
  };

  const handleSubmitAddress = async (data: TCreateAddressInput) => {
    setIsAddingAddress(true);
    try {
      const success = editingAddress
        ? await updateAddress(editingAddress.id, data)
        : await addAddress(data);

      if (success) {
        closeAddModal();
      }
      return success;
    } finally {
      setIsAddingAddress(false);
    }
  };

  const { selectedItems, totalAmount, placingOrder, handlePlaceOrder } =
    useCheckout(selectedAddressId);

  return (
    <AppContainer className="animate-in fade-in slide-in-from-bottom-6 py-8 duration-700 md:py-12">
      <CheckoutHeader />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-10 lg:col-span-8 lg:space-y-16">
          <ShippingSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            loading={loadingAddresses}
            onAddAddress={openAddModal}
            onClickEdit={openEditModal}
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
        onSubmit={handleSubmitAddress}
        loading={isAddingAddress}
        editingAddress={editingAddress}
      />
    </AppContainer>
  );
};
