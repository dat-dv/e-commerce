"use client";

import { Button } from "@ecommerce/ui";
import { AppForm } from "@ecommerce/ui";
import { FormInput } from "@ecommerce/ui";
import { FormPhoneInput } from "@ecommerce/ui";
import { FormTextarea } from "@ecommerce/ui";
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
          size="lg"
        />
        <FormInput
          name="contact_email"
          label={t("emailLabel")}
          type="email"
          placeholder={t("emailPlaceholder")}
          size="lg"
        />
      </div>

      <FormPhoneInput
        name="contact_phone"
        label={t("phoneLabel")}
        disabled={isSubmitting}
        size="lg"
      />

      <FormInput
        name="subject"
        label={t("subjectLabel")}
        placeholder={t("subjectPlaceholder")}
        maxCount={160}
        size="lg"
      />

      <FormTextarea
        name="message"
        label={t("messageLabel")}
        placeholder={t("messagePlaceholder")}
        rows={6}
        maxCount={5000}
      />

      <div>
        <label className="text-content/80 mb-2 block text-sm font-bold">
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
          className="text-content/70 flex min-h-20 w-full flex-col border-dashed sm:min-h-24"
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
                className="border-content/5 bg-surface flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm sm:gap-3"
              >
                <ImageIcon
                  className="text-content/45 size-4 shrink-0"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="text-content/35 hidden shrink-0 text-xs font-bold sm:inline">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttachment(index)}
                  className="text-content/45 hover:bg-content/5 size-8 shrink-0 rounded-lg"
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
        size="lg"
        className="w-full"
        loading={isSubmitting}
      >
        {isSubmitting ? t("sending") : t("send")}
      </Button>
    </AppForm>
  );
}
