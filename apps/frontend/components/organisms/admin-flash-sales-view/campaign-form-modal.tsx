"use client";

import Button from "@/components/atoms/button";
import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import { XIcon } from "@/components/atoms/icons";
import Input from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import AppForm from "@/components/molecules/form/app-form";
import { FormInput } from "@/components/molecules/form/form-input";
import type {
  TCreateFlashSaleInput,
  TFlashSaleTimeSlot,
} from "@/domain/flash-sales/types/flash-sale.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  campaignFormSchema,
  type CampaignFormData,
} from "./campaign-form.schema";

interface CampaignFormModalProps {
  isOpen: boolean;
  loading: boolean;
  timeSlots: TFlashSaleTimeSlot[];
  onClose: () => void;
  onSubmit: (input: TCreateFlashSaleInput) => Promise<boolean>;
}

const defaultValues: CampaignFormData = {
  name: "",
  startTime: "",
  endTime: "",
  timeSlotId: "",
};

export function CampaignFormModal({
  isOpen,
  loading,
  timeSlots,
  onClose,
  onSubmit,
}: CampaignFormModalProps) {
  const t = useTranslations("AdminFlashSalesPage.campaignForm");
  const tCommon = useTranslations("Common.modal");

  const methods = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: CampaignFormData) => {
    const success = await onSubmit({
      name: data.name,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      timeSlotId: data.timeSlotId || undefined,
      products: [],
    });

    if (success) {
      methods.reset(defaultValues);
      onClose();
    }
  };

  const timeSlotOptions = useMemo(() => {
    const options = timeSlots
      .filter((slot) => slot.isActive)
      .map((slot) => ({
        label: `${slot.name} (${String(slot.startHour).padStart(2, "0")}:${String(
          slot.startMinute,
        ).padStart(2, "0")} - ${String(slot.endHour).padStart(2, "0")}:${String(
          slot.endMinute,
        ).padStart(2, "0")})`,
        value: slot.id,
      }));

    return [{ label: t("timeSlotNone"), value: "" }, ...options];
  }, [timeSlots, t]);

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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                control={methods.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="startTime"
                    type="datetime-local"
                    label={t("startTime")}
                    disabled={loading}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={methods.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="endTime"
                    type="datetime-local"
                    label={t("endTime")}
                    disabled={loading}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <Controller
              control={methods.control}
              name="timeSlotId"
              render={({ field, fieldState }) => (
                <Select
                  label={t("timeSlot")}
                  placeholder={t("timeSlotNone")}
                  selectedKey={field.value || ""}
                  onSelectionChange={(key) => field.onChange(key as string)}
                  errorMessage={fieldState.error?.message}
                  options={timeSlotOptions}
                  isDisabled={loading}
                />
              )}
            />

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
