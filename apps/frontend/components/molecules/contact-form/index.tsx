"use client";

import Button from "@/components/atoms/button";
import AppForm from "@/components/molecules/form/app-form";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";
import { FormTextarea } from "@/components/molecules/form/form-textarea";
import {
  HELP_CONTACT_ALLOWED_IMAGE_TYPES,
  HELP_CONTACT_MAX_ATTACHMENTS,
  useHelpContactForm,
} from "@/hooks/help-contact-submissions/use-help-contact-form";
import { ImageIcon, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("HelpCenter.contact.form");

  const {
    methods,
    attachments,
    isSubmitting,
    fileInputRef,
    handleAttachmentChange,
    removeAttachment,
    onSubmit,
  } = useHelpContactForm();

  return (
    <AppForm
      methods={methods}
      onSubmit={onSubmit}
      className="space-y-4 sm:space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          name="contact_name"
          label={t("nameLabel")}
          placeholder={t("namePlaceholder")}
          maxCount={120}
          className="h-12 rounded-xl border-2 border-content/5 bg-surface px-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none sm:px-5"
        />
        <FormInput
          name="contact_email"
          label={t("emailLabel")}
          type="email"
          placeholder={t("emailPlaceholder")}
          className="h-12 rounded-xl border-2 border-content/5 bg-surface px-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none sm:px-5"
        />
      </div>

      <FormPhoneInput
        name="contact_phone"
        label={t("phoneLabel")}
        disabled={isSubmitting}
        className="h-12 rounded-xl text-sm"
      />

      <FormInput
        name="subject"
        label={t("subjectLabel")}
        placeholder={t("subjectPlaceholder")}
        maxCount={160}
        className="h-12 rounded-xl border-2 border-content/5 bg-surface px-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none sm:px-5"
      />

      <FormTextarea
        name="message"
        label={t("messageLabel")}
        placeholder={t("messagePlaceholder")}
        rows={6}
        maxCount={5000}
        className="border-2 border-content/5 bg-surface shadow-sm"
      />

      <div>
        <label className="mb-2 block text-sm font-bold text-content/80">
          {t("attachmentsLabel")}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept={HELP_CONTACT_ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          className="sr-only"
          onChange={handleAttachmentChange}
        />
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-20 w-full flex-col rounded-xl border-dashed text-content/70 sm:min-h-24"
          disabled={isSubmitting}
        >
          <Upload className="size-5" aria-hidden />
          <span className="text-sm font-bold">
            {t("uploadLabel", {
              count: String(attachments.length),
              max: String(HELP_CONTACT_MAX_ATTACHMENTS),
            })}
          </span>
        </Button>

        {attachments.length > 0 && (
          <ul className="mt-3 grid gap-2">
            {attachments.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}`}
                className="flex min-w-0 items-center gap-2 rounded-xl border border-content/5 bg-surface px-3 py-2 text-sm sm:gap-3"
              >
                <ImageIcon
                  className="size-4 shrink-0 text-content/45"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="hidden shrink-0 text-xs font-bold text-content/35 sm:inline">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttachment(index)}
                  className="size-8 shrink-0 rounded-lg text-content/45 hover:bg-content/5"
                  aria-label={`Remove ${file.name}`}
                  disabled={isSubmitting}
                >
                  <X className="size-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="h-12 w-full rounded-xl"
        loading={isSubmitting}
      >
        {isSubmitting ? t("sending") : t("send")}
      </Button>
    </AppForm>
  );
}
