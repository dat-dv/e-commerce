import { useState } from "react";
import {
  TAddress,
  TCreateAddressInput,
} from "@/domain/addresses/types/address.model";

interface UseCreateAddressProps {
  onSuccess?: () => void;
  onSubmit: (
    data: TCreateAddressInput,
    editingAddress?: TAddress | null,
  ) => Promise<boolean>;
}

export const useCreateAddress = ({
  onSuccess,
  onSubmit,
}: UseCreateAddressProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState<TAddress | null>(null);

  const open = () => {
    setEditingAddress(null);
    setIsOpen(true);
  };

  const openEdit = (address: TAddress) => {
    setEditingAddress(address);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (data: TCreateAddressInput) => {
    setIsSubmitting(true);
    const success = await onSubmit(data, editingAddress);
    setIsSubmitting(false);

    if (success) {
      close();
      onSuccess?.();
    }
    return success;
  };

  return {
    isOpen,
    isSubmitting,
    editingAddress,
    open,
    openEdit,
    close,
    handleSubmit,
  };
};
