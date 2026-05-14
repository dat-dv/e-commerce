import { useState } from "react";
import { ICreateAddressInput } from "@/domain/addresses/types/address.model";

interface UseCreateAddressProps {
  onSuccess?: () => void;
  onSubmit: (data: ICreateAddressInput) => Promise<boolean>;
}

export const useCreateAddress = ({
  onSuccess,
  onSubmit,
}: UseCreateAddressProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleSubmit = async (data: ICreateAddressInput) => {
    setIsSubmitting(true);
    const success = await onSubmit(data);
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
    open,
    close,
    handleSubmit,
  };
};
