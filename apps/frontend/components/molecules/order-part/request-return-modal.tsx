"use client";

import Button from "@/components/atoms/button";
import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import Input from "@/components/atoms/input";
import { toast } from "@/components/ui/toast";
import {
  OrderReturnRequestFormData,
  getOrderReturnRequestSchema,
} from "@/hooks/order-returns/order-return-request.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { ImageIcon, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const ORDER_RETURN_MAX_ATTACHMENTS = 6;
const ORDER_RETURN_MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ORDER_RETURN_ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

interface RequestReturnModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: OrderReturnRequestFormData,
    attachments: File[],
  ) => Promise<boolean>;
}

const AttachmentPreview = ({
  file,
  onRemove,
  disabled,
}: {
  file: File;
  onRemove: () => void;
  disabled: boolean;
}) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border border-content/[0.08] bg-content/[0.03]">
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt={file.name}
          fill
          sizes="88px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageIcon className="h-5 w-5 text-content/30" />
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={onRemove}
        disabled={disabled}
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50 h-auto w-auto p-0"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

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

  const localizedSchema = useMemo(
    () => getOrderReturnRequestSchema(tValidation),
    [tValidation],
  );

  const methods = useForm<OrderReturnRequestFormData>({
    resolver: zodResolver(localizedSchema),
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
          <AppDialogPanel className="my-6 w-full max-w-xl rounded-2xl border border-content/[0.06] bg-surface/90 p-6 shadow-2xl backdrop-blur-2xl">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <AppDialogTitle
                    as="h3"
                    className="text-xl font-bold tracking-tight text-content"
                  >
                    {t("title")}
                  </AppDialogTitle>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-content/55">
                    {t("description")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-content/[0.08] text-content/50 hover:bg-content/[0.05] disabled:opacity-50 p-0"
                  aria-label={t("close")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-content/45">
                    {t("reason")}
                  </label>
                  <Input
                    {...register("title")}
                    disabled={isSubmitting}
                    placeholder={t("reasonPlaceholder")}
                    className="w-full rounded-xl border-content/[0.08] bg-content/[0.03] px-4 py-3 placeholder:text-content/30 focus:border-primary/40 disabled:opacity-60"
                  />
                  {errors.title ? (
                    <p className="mt-2 text-xs font-semibold text-red-500">
                      {errors.title.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-content/45">
                    {t("details")}
                  </label>
                  <textarea
                    {...register("description")}
                    disabled={isSubmitting}
                    rows={5}
                    placeholder={t("detailsPlaceholder")}
                    className="w-full resize-none rounded-xl border border-content/[0.08] bg-content/[0.03] px-4 py-3 text-sm font-medium leading-relaxed text-content outline-none transition-colors placeholder:text-content/30 focus:border-primary/40 disabled:opacity-60"
                  />
                  {errors.description ? (
                    <p className="mt-2 text-xs font-semibold text-red-500">
                      {errors.description.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-xs font-bold uppercase tracking-wide text-content/45">
                      {t("evidence")}
                    </label>
                    <span className="text-xs font-semibold text-content/35">
                      {attachments.length}/{ORDER_RETURN_MAX_ATTACHMENTS}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleAttachmentChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      isSubmitting ||
                      attachments.length >= ORDER_RETURN_MAX_ATTACHMENTS
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-dashed border-content/[0.14] bg-content/[0.02] px-4 py-4 text-sm font-semibold text-content/60 hover:border-primary/30 hover:bg-primary/[0.04] disabled:opacity-50 h-auto"
                  >
                    <Upload className="h-4 w-4" />
                    {t("upload")}
                  </Button>

                  {attachments.length ? (
                    <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {attachments.map((file, index) => (
                        <AttachmentPreview
                          key={`${file.name}-${file.lastModified}`}
                          file={file}
                          disabled={isSubmitting}
                          onRemove={() => removeAttachment(index)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs font-medium text-content/35">
                      {t("photoRequired")}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-xl border-content/[0.1] px-5 py-3 text-sm font-semibold text-content hover:bg-content/[0.05] disabled:opacity-50 h-auto"
                >
                  {t("keepOrder")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center rounded-xl bg-content px-5 py-3 text-sm font-semibold text-surface shadow-lg shadow-black/10 hover:bg-primary disabled:opacity-50 h-auto"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 rounded-full border-2 border-surface/30 border-t-surface animate-spin" />
                  ) : (
                    t("submit")
                  )}
                </Button>
              </div>
            </form>
          </AppDialogPanel>
        </AppDialog>
      ) : null}
    </AnimatePresence>
  );
};
