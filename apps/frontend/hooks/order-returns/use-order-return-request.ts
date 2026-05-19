import { orderReturnsUseCase } from "@/domain/order-returns";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { OrderReturnRequestFormData } from "./order-return-request.schema";

interface UseOrderReturnRequestParams {
  orderId: string;
  onSuccess?: () => Promise<void> | void;
}

const getErrorMessage = (error: Error) => {
  return error.message || "Failed to submit return request.";
};

export const useOrderReturnRequest = ({
  orderId,
  onSuccess,
}: UseOrderReturnRequestParams) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadAttachments = useCallback(async (attachments: File[]) => {
    const uploadResults = await Promise.all(
      attachments.map((file) => orderReturnsUseCase.uploadImage.execute(file)),
    );

    return uploadResults.map((result) => result.data.id);
  }, []);

  const submitReturnRequest = useCallback(
    async (
      data: OrderReturnRequestFormData,
      attachments: File[],
    ): Promise<boolean> => {
      if (!attachments.length) {
        toast.error("Attach at least one image for the return request.");
        return false;
      }

      setIsSubmitting(true);
      try {
        const imageIds = await uploadAttachments(attachments);

        await orderReturnsUseCase.create.execute({
          orderId,
          title: data.title.trim(),
          description: data.description.trim(),
          imageIds,
        });

        toast.success("Return request submitted.");
        await onSuccess?.();
        return true;
      } catch (error) {
        toast.error(
          getErrorMessage(
            error instanceof Error
              ? error
              : new Error("Failed to submit return request."),
          ),
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, orderId, uploadAttachments],
  );

  return {
    isSubmitting,
    submitReturnRequest,
  };
};
