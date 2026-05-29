import { toast } from "@/components/atoms/toast";
import { orderReturnsUseCase } from "@/domain/order-returns";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { OrderReturnRequestFormData } from "./order-return-request.schema";

interface UseOrderReturnRequestParams {
  orderId: string;
  onSuccess?: () => Promise<void> | void;
}

const getErrorMessage = (error: Error, fallback: string) => {
  return error.message || fallback;
};

export const useOrderReturnRequest = ({
  orderId,
  onSuccess,
}: UseOrderReturnRequestParams) => {
  const t = useTranslations("OrdersPage.requestReturn");
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
        toast.error(t("toasts.imageRequired"));
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

        toast.success(t("toasts.submitSuccess"));
        await onSuccess?.();
        return true;
      } catch (error) {
        toast.error(
          getErrorMessage(
            error instanceof Error ? error : new Error(t("toasts.submitError")),
            t("toasts.submitError"),
          ),
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, orderId, uploadAttachments, t],
  );

  return {
    isSubmitting,
    submitReturnRequest,
  };
};
