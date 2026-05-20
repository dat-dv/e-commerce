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
            className="text-xl font-bold tracking-tight text-content"
          >
            {labels.title}
          </AppDialogTitle>
          <p className="mt-1 text-sm font-medium leading-relaxed text-content/55">
            {labels.description}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-content/[0.08] text-content/50 hover:bg-content/[0.05] disabled:opacity-50 p-0"
          aria-label={labels.close}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5">
        <Input
          {...register("title")}
          id="return-title"
          label={labels.reason}
          error={errors.title?.message}
          disabled={isSubmitting}
          placeholder={labels.reasonPlaceholder}
          className="w-full rounded-xl border-content/[0.08] bg-content/[0.03] px-4 py-3 placeholder:text-content/30 focus:border-primary/40 disabled:opacity-60"
        />

        <Textarea
          {...register("description")}
          id="return-description"
          label={labels.details}
          error={errors.description?.message}
          disabled={isSubmitting}
          rows={5}
          placeholder={labels.detailsPlaceholder}
          className="resize-none border-content/[0.08] bg-content/[0.03] px-4 py-3 placeholder:text-content/30 focus:border-primary/40"
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
          className="rounded-xl border-content/[0.1] px-5 py-3 text-sm font-semibold text-content hover:bg-content/[0.05] disabled:opacity-50 h-auto"
        >
          {labels.keepOrder}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center rounded-xl bg-content px-5 py-3 text-sm font-semibold text-surface shadow-lg shadow-black/10 hover:bg-primary disabled:opacity-50 h-auto"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 rounded-full border-2 border-surface/30 border-t-surface animate-spin" />
          ) : (
            labels.submit
          )}
        </Button>
      </div>
    </form>
  );
}
