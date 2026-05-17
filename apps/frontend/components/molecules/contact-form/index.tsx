"use client";

import Button from "@/components/atoms/button";
import AppForm from "@/components/molecules/form/app-form";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";
import {
  HELP_CONTACT_ALLOWED_IMAGE_TYPES,
  HELP_CONTACT_MAX_ATTACHMENTS,
  useHelpContactForm,
} from "@/hooks/help-contact-submissions/use-help-contact-form";
import { ImageIcon, Upload, X } from "lucide-react";
import React from "react";
import { Controller } from "react-hook-form";

export default function ContactForm() {
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
    <AppForm methods={methods} onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          name="contact_name"
          label="Name"
          placeholder="Your name"
          maxCount={120}
          className="h-12 px-5 rounded-xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
        />
        <FormInput
          name="contact_email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          className="h-12 px-5 rounded-xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
        />
      </div>

      <FormPhoneInput
        name="contact_phone"
        label="Phone"
        disabled={isSubmitting}
        className="h-12 text-sm rounded-xl"
      />

      <FormInput
        name="subject"
        label="Subject"
        placeholder="How can we help?"
        maxCount={160}
        className="h-12 px-5 rounded-xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
      />

      <div>
        <label className="text-sm font-bold text-content/80 block mb-2">
          Message
        </label>
        <Controller
          name="message"
          control={methods.control}
          rules={{ required: "Message is required" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <textarea
                {...field}
                placeholder="Describe your issue in detail..."
                rows={6}
                maxLength={5000}
                className="w-full px-5 py-3 rounded-xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm resize-y min-h-36"
              />
              <div className="mt-1 flex justify-between gap-3 text-[11px] font-bold text-content/35">
                <span>{error?.message}</span>
                <span>{String(field.value ?? "").length}/5000</span>
              </div>
            </div>
          )}
        />
      </div>

      <div>
        <label className="text-sm font-bold text-content/80 block mb-2">
          Attachments
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
          className="w-full min-h-24 rounded-xl border-dashed flex-col text-content/70"
          disabled={isSubmitting}
        >
          <Upload className="size-5" aria-hidden />
          <span className="text-sm font-bold">
            Upload images ({attachments.length}/{HELP_CONTACT_MAX_ATTACHMENTS})
          </span>
        </Button>

        {attachments.length > 0 && (
          <ul className="mt-3 grid gap-2">
            {attachments.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}`}
                className="flex items-center gap-3 rounded-xl border border-content/5 bg-surface px-3 py-2 text-sm"
              >
                <ImageIcon
                  className="size-4 shrink-0 text-content/45"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="shrink-0 text-xs font-bold text-content/35">
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
        className="w-full h-12 rounded-xl"
        loading={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </AppForm>
  );
}
