"use client";

import Button from "@/components/atoms/button";
import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import { XIcon } from "@/components/atoms/icons";
import AppForm from "@/components/molecules/form/app-form";
import { FormCheckbox } from "@/components/molecules/form/form-checkbox";
import { FormInput } from "@/components/molecules/form/form-input";
import type { TCreateTimeSlotInput } from "@/domain/flash-sales/types/flash-sale.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  timeSlotFormSchema,
  type TimeSlotFormData,
} from "./time-slot-form.schema";

interface TimeSlotFormModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (input: TCreateTimeSlotInput) => Promise<boolean>;
}

const defaultValues: TimeSlotFormData = {
  name: "",
  startHour: 0,
  startMinute: 0,
  endHour: 23,
  endMinute: 59,
  isActive: true,
};

export function TimeSlotFormModal({
  isOpen,
  loading,
  onClose,
  onSubmit,
}: TimeSlotFormModalProps) {
  const t = useTranslations("AdminFlashSalesPage.timeSlotForm");
  const tCommon = useTranslations("Common.modal");
  const methods = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: TimeSlotFormData) => {
    const success = await onSubmit({
      name: data.name,
      startHour: Number(data.startHour),
      startMinute: Number(data.startMinute),
      endHour: Number(data.endHour),
      endMinute: Number(data.endMinute),
      isActive: data.isActive,
    });

    if (success) {
      methods.reset(defaultValues);
      onClose();
    }
  };

  return (
    <AppDialog isOpen={isOpen} onClose={onClose}>
      <AppDialogPanel className="bg-surface/95 border-content/10 relative w-full max-w-xl overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-3xl">
        <div className="border-content/5 bg-surface/50 flex items-center justify-between border-b px-6 py-5 backdrop-blur-xl sm:px-8">
          <div>
            <AppDialogTitle className="text-content text-xl font-bold">
              {t("title")}
            </AppDialogTitle>
            <p className="text-content/50 mt-1 text-sm">{t("description")}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-content/5 rounded-full"
            aria-label={tCommon("close")}
          >
            <XIcon className="size-5" />
          </Button>
        </div>

        <div className="p-6 sm:p-8">
          <AppForm
            methods={methods}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <FormInput
              name="name"
              label={t("name")}
              placeholder={t("namePlaceholder")}
              disabled={loading}
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <FormInput
                name="startHour"
                type="number"
                label={t("startHour")}
                min={0}
                max={23}
                disabled={loading}
              />
              <FormInput
                name="startMinute"
                type="number"
                label={t("startMinute")}
                min={0}
                max={59}
                disabled={loading}
              />
              <FormInput
                name="endHour"
                type="number"
                label={t("endHour")}
                min={0}
                max={23}
                disabled={loading}
              />
              <FormInput
                name="endMinute"
                type="number"
                label={t("endMinute")}
                min={0}
                max={59}
                disabled={loading}
              />
            </div>

            <FormCheckbox name="isActive" isDisabled={loading}>
              {t("isActive")}
            </FormCheckbox>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" loading={loading}>
                {t("submit")}
              </Button>
            </div>
          </AppForm>
        </div>
      </AppDialogPanel>
    </AppDialog>
  );
}
