"use client";

import { FormCard } from "@/components/atoms/form-card";
import AddressCard from "@/components/molecules/address-card";
import AddressEmptyState from "@/components/molecules/address-empty-state";
import AddressLoadingCard from "@/components/molecules/address-loading-card";
import { AddressesForm } from "@/components/molecules/addresses-form";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import { useAddresses } from "@/hooks/profile/use-addresses";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useTranslations } from "next-intl";
import AddressViewHeader from "./address-view-header";

export const AddressesView = () => {
  const t = useTranslations("ProfileAddressesPage");
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
    <div className="min-w-0 space-y-5 sm:space-y-6">
      {/* Header */}
      <AddressViewHeader
        title={t("title")}
        description={t("description")}
        actionLabel={t("addAddress")}
        onPress={() => setShowForm(!showForm)}
      />
      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FormCard>
              <h2 className="text-base font-bold text-content mb-4">
                {t("newAddress")}
              </h2>
              <AddressesForm onSubmit={handleAddAddress} loading={adding} />
            </FormCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
          <AddressLoadingCard />
          <AddressLoadingCard />
        </div>
      )}

      {/* Empty State */}
      {!loading && addresses.length === 0 && (
        <AddressEmptyState
          title={t("empty.title")}
          description={t("empty.description")}
          actionLabel={t("empty.actionLabel")}
          onAction={() => setShowForm(true)}
        />
      )}

      {/* Address List */}
      {!loading && addresses.length > 0 && (
        <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
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
