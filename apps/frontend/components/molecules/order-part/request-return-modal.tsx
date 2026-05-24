"use client";

import { AppDialog, AppDialogPanel } from "@/components/atoms/dialog";
import { RequestReturnForm } from "@/components/molecules/order-part/request-return-form";
import { toast } from "@/components/ui/toast";
import {
  OrderReturnRequestFormData,
  getOrderReturnRequestSchema,
} from "@/hooks/order-returns/order-return-request.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ORDER_RETURN_ALLOWED_IMAGE_TYPES,
  ORDER_RETURN_MAX_ATTACHMENTS,
  ORDER_RETURN_MAX_IMAGE_SIZE,
} from "./request-return.constants";

interface RequestReturnModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: OrderReturnRequestFormData,
    attachments: File[],
  ) => Promise<boolean>;
}

export const RequestReturnModal = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: RequestReturnModalProps) => {
  const t = useTranslations("OrdersPage.requestReturn");
  const tValidation = useTranslations("Validation");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const defaultValues = useMemo<OrderReturnRequestFormData>(
    () => ({
      title: "",
      description: "",
    }),
    [],
  );

  const schema = useMemo(
    () => getOrderReturnRequestSchema(tValidation),
    [tValidation],
  );

  const methods = useForm<OrderReturnRequestFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const resetForm = useCallback(() => {
    methods.reset(defaultValues);
    setAttachments([]);
  }, [defaultValues, methods]);

  const closeModal = useCallback(() => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }, [isSubmitting, onClose, resetForm]);

  const handleAttachmentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files ?? []);
      event.target.value = "";

      if (!selectedFiles.length) return;

      const validFiles = selectedFiles.filter((file) => {
        if (!ORDER_RETURN_ALLOWED_IMAGE_TYPES.includes(file.type)) {
          toast.error(t("toasts.unsupportedImage", { name: file.name }));
          return false;
        }

        if (file.size > ORDER_RETURN_MAX_IMAGE_SIZE) {
          toast.error(t("toasts.imageTooLarge", { name: file.name }));
          return false;
        }

        return true;
      });

      setAttachments((current) => {
        const next = [...current, ...validFiles].slice(
          0,
          ORDER_RETURN_MAX_ATTACHMENTS,
        );
        if (current.length + validFiles.length > ORDER_RETURN_MAX_ATTACHMENTS) {
          toast.info(
            t("toasts.maxImages", {
              max: String(ORDER_RETURN_MAX_ATTACHMENTS),
            }),
          );
        }
        return next;
      });
    },
    [t],
  );

  const removeAttachment = useCallback((index: number) => {
    setAttachments((current) => current.filter((_, i) => i !== index));
  }, []);

  const handleFormSubmit = useCallback(
    async (data: OrderReturnRequestFormData) => {
      if (!attachments.length) {
        toast.error(t("toasts.imageRequired"));
        return;
      }

      const isSuccess = await onSubmit(data, attachments);
      if (isSuccess) {
        resetForm();
      }
    },
    [attachments, onSubmit, resetForm, t],
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <AppDialog isOpen={isOpen} onClose={closeModal}>
          <AppDialogPanel className="border-content/[0.06] bg-surface/90 my-6 w-full max-w-xl rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl">
            <RequestReturnForm
              isSubmitting={isSubmitting}
              attachments={attachments}
              fileInputRef={fileInputRef}
              register={register}
              errors={errors}
              onSubmit={handleSubmit(handleFormSubmit)}
              onClose={closeModal}
              onAttachmentChange={handleAttachmentChange}
              onRemoveAttachment={removeAttachment}
              labels={{
                title: t("title"),
                description: t("description"),
                close: t("close"),
                reason: t("reason"),
                reasonPlaceholder: t("reasonPlaceholder"),
                details: t("details"),
                detailsPlaceholder: t("detailsPlaceholder"),
                evidence: t("evidence"),
                upload: t("upload"),
                photoRequired: t("photoRequired"),
                keepOrder: t("keepOrder"),
                submit: t("submit"),
              }}
            />
          </AppDialogPanel>
        </AppDialog>
      ) : null}
    </AnimatePresence>
  );
};
