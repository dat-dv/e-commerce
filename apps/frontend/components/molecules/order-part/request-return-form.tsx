"use client";

import Button from "@/components/atoms/button";
import { AppDialogTitle } from "@/components/atoms/dialog";
import Input from "@/components/atoms/input";
import Textarea from "@/components/atoms/textarea";
import { OrderReturnRequestFormData } from "@/hooks/order-returns/order-return-request.schema";
import { X } from "lucide-react";
import type { ChangeEvent, FormEventHandler, RefObject } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { AttachmentDropzone } from "./attachment-dropzone";

export function RequestReturnForm({
  isSubmitting,
  attachments,
  fileInputRef,
  labels,
  register,
  errors,
  onSubmit,
  onClose,
  onAttachmentChange,
  onRemoveAttachment,
}: {
  isSubmitting: boolean;
  attachments: File[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  labels: {
    title: string;
    description: string;
    close: string;
    reason: string;
    reasonPlaceholder: string;
    details: string;
    detailsPlaceholder: string;
    evidence: string;
    upload: string;
    photoRequired: string;
    keepOrder: string;
    submit: string;
  };
  register: UseFormRegister<OrderReturnRequestFormData>;
  errors: FieldErrors<OrderReturnRequestFormData>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClose: () => void;
  onAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <AppDialogTitle
            as="h3"
            className="text-content text-xl font-bold tracking-tight"
          >
            {labels.title}
          </AppDialogTitle>
          <p className="text-content/55 mt-1 text-sm leading-relaxed font-medium">
            {labels.description}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
          className="border-content/[0.08] text-content/50 hover:bg-content/[0.05] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border p-0 disabled:opacity-50"
          aria-label={labels.close}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5">
        <Input
          aria-label={labels.reason}
          {...register("title")}
          id="return-title"
          label={labels.reason}
          error={errors.title?.message}
          disabled={isSubmitting}
          placeholder={labels.reasonPlaceholder}
          variant="outline"
          size="md"
        />

        <Textarea
          {...register("description")}
          id="return-description"
          label={labels.details}
          error={errors.description?.message}
          disabled={isSubmitting}
          rows={5}
          placeholder={labels.detailsPlaceholder}
        />

        <AttachmentDropzone
          attachments={attachments}
          disabled={isSubmitting}
          fileInputRef={fileInputRef}
          labels={{
            evidence: labels.evidence,
            upload: labels.upload,
            photoRequired: labels.photoRequired,
          }}
          onAttachmentChange={onAttachmentChange}
          onRemoveAttachment={onRemoveAttachment}
        />
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          size="md"
          className="w-full sm:w-auto"
        >
          {labels.keepOrder}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          size="md"
          className="flex w-full items-center justify-center sm:w-auto"
        >
          {isSubmitting ? (
            <span className="border-surface/30 border-t-surface h-4 w-4 animate-spin rounded-full border-2" />
          ) : (
            labels.submit
          )}
        </Button>
      </div>
    </form>
  );
}
