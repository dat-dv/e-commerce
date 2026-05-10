"use client";

import Button from "@/components/atoms/button";
import AppForm from "@/components/molecules/form/app-form";
import { FormInput } from "@/components/molecules/form/form-input";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type ContactFormData = {
  subject: string;
  message: string;
};

export default function ContactForm() {
  const methods = useForm<ContactFormData>({
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Form Data:", data);
    // Handle submission (e.g., call API)
    alert("Message sent! We will get back to you soon.");
    methods.reset();
  };

  return (
    <AppForm methods={methods} onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-bold text-content/80 block mb-2">
          Subject
        </label>
        <FormInput
          name="subject"
          placeholder="How can we help?"
          className="w-full h-12 px-5 rounded-xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
        />
      </div>
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
                rows={5}
                className="w-full px-5 py-3 rounded-xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
              ></textarea>
              {error && (
                <p className="text-xs text-red-500 mt-1">{error.message}</p>
              )}
            </div>
          )}
        />
      </div>
      <Button variant="primary" size="md" className="w-full h-12 rounded-xl">
        Send Message
      </Button>
    </AppForm>
  );
}
