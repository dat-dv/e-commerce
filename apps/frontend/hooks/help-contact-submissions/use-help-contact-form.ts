import { toast } from "@/components/atoms/toast";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { helpContactSubmissionsUseCase } from "@/domain/help-contact-submissions/use-cases";
import {
  HelpContactFormData,
  getHelpContactFormSchema,
} from "./help-contact-form.schema";

export const HELP_CONTACT_MAX_ATTACHMENTS = 6;
export const HELP_CONTACT_MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const HELP_CONTACT_ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const useHelpContactForm = () => {
  const t = useTranslations("HelpCenter.contact.toasts");
  const tValidation = useTranslations("Validation");
  const user = useAuthStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrorMessage = (error: Error) => {
    return error.message || t("sendFailed");
  };

  const schema = useMemo(
    () => getHelpContactFormSchema(tValidation),
    [tValidation],
  );

  const defaultValues = useMemo<HelpContactFormData>(() => {
    const contactName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ");
    const defaultPhone = user?.phones?.find((phone) => phone.isDefault);

    return {
      contact_name: contactName,
      contact_email: user?.email ?? "",
      contact_phone: defaultPhone ?? {
        phoneCode: "+84",
        phoneNumber: "",
      },
      subject: "",
      message: "",
    };
  }, [user?.email, user?.firstName, user?.lastName, user?.phones]);

  const methods = useForm<HelpContactFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!methods.formState.isDirty) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  const handleAttachmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const validFiles = selectedFiles.filter((file) => {
      if (!HELP_CONTACT_ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(t("unsupportedType", { fileName: file.name }));
        return false;
      }

      if (file.size > HELP_CONTACT_MAX_IMAGE_SIZE) {
        toast.error(t("imageTooLarge", { fileName: file.name }));
        return false;
      }

      return true;
    });

    setAttachments((current) => {
      const next = [...current, ...validFiles].slice(
        0,
        HELP_CONTACT_MAX_ATTACHMENTS,
      );
      if (current.length + validFiles.length > HELP_CONTACT_MAX_ATTACHMENTS) {
        toast.info(
          t("maxAttachments", { max: String(HELP_CONTACT_MAX_ATTACHMENTS) }),
        );
      }
      return next;
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((current) => current.filter((_, i) => i !== index));
  };

  const uploadAttachments = async () => {
    const uploadResults = await Promise.all(
      attachments.map((file) =>
        helpContactSubmissionsUseCase.uploadImage.execute(file),
      ),
    );

    return uploadResults.map((result) => result.data.id);
  };

  const onSubmit = async (data: HelpContactFormData) => {
    const contactEmail = data.contact_email.trim();
    const contactPhoneNumber = data.contact_phone.phoneNumber.trim();
    const contactPhone = contactPhoneNumber
      ? `${data.contact_phone.phoneCode}${contactPhoneNumber}`
      : "";
    const subject = data.subject.trim();
    const message = data.message.trim();

    setIsSubmitting(true);
    try {
      const imageIds = await uploadAttachments();

      await helpContactSubmissionsUseCase.create.execute({
        contactName: data.contact_name.trim() || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        subject,
        message,
        imageIds,
      });

      toast.success(t("sendSuccess"));
      methods.reset(defaultValues);
      setAttachments([]);
      fileInputRef.current?.blur();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error instanceof Error ? error : new Error(t("sendFailed")),
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    methods,
    attachments,
    isSubmitting,
    fileInputRef,
    handleAttachmentChange,
    removeAttachment,
    onSubmit,
  };
};
