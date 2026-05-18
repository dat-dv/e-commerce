"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAddresses } from "@/hooks/profile/use-addresses";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import Button from "@/components/atoms/button";
import { AddressesForm } from "@/components/molecules/addresses-form";
import { motion, AnimatePresence } from "framer-motion";
import AddressCard from "@/components/molecules/address-card";
import AddressEmptyState from "@/components/molecules/address-empty-state";
import AddressLoadingCard from "@/components/molecules/address-loading-card";

export const AddressesView = () => {
  const {
    addresses,
    loading,
    adding,
    mutatingId,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();
  const [showForm, setShowForm] = useState(false);

  const handleAddAddress = async (
    data: TCreateAddressInput,
  ): Promise<boolean> => {
    const success = await addAddress(data);
    if (success) setShowForm(false);
    return success;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-content tracking-tight">
            My Addresses
          </h1>
          <p className="text-sm text-content/50 mt-1">
            Manage your shipping destinations.
          </p>
        </div>
        <Button
          className="flex items-center gap-2 rounded-xl"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} />
          Add Address
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 border border-primary/20 rounded-2xl bg-surface/60 backdrop-blur-md"
          >
            <h2 className="text-base font-bold text-content mb-4">
              New Address
            </h2>
            <AddressesForm onSubmit={handleAddAddress} loading={adding} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          <AddressLoadingCard />
          <AddressLoadingCard />
        </div>
      )}

      {/* Empty State */}
      {!loading && addresses.length === 0 && (
        <AddressEmptyState
          title="No Addresses Yet"
          description="Add a shipping address to get started."
          actionLabel="Add Address"
        />
      )}

      {/* Address List */}
      {!loading && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <motion.div key={addr.id} layout>
              <AddressCard
                address={addr}
                mode="manage"
                disabled={!!mutatingId}
                isMutating={mutatingId === addr.id}
                onSetDefault={() => setDefaultAddress(addr.id)}
                onDelete={() => deleteAddress(addr.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
