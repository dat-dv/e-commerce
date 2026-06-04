"use client";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
  Button,
  XIcon,
} from "@ecommerce/ui";

import { AppForm } from "@ecommerce/ui";
import { FormInput } from "@ecommerce/ui";
import { FormSelect } from "@ecommerce/ui";
import {
  FORM_ACTION_ROW_CLASS_NAME,
  FORM_STACK_CLASS_NAME,
  FORM_TWO_COLUMN_GRID_CLASS_NAME,
} from "@/constants/grid-presets";
import type {
  TCreateFlashSaleInput,
  TFlashSaleTimeSlot,
} from "@/domain/flash-sales/types/flash-sale.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
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
            className={FORM_STACK_CLASS_NAME}
          >
            <FormInput
              name="name"
              label={t("name")}
              placeholder={t("namePlaceholder")}
              disabled={loading}
            />

            <div className={FORM_TWO_COLUMN_GRID_CLASS_NAME}>
              <FormInput
                name="startTime"
                type="datetime-local"
                label={t("startTime")}
                disabled={loading}
              />
              <FormInput
                name="endTime"
                type="datetime-local"
                label={t("endTime")}
                disabled={loading}
              />
            </div>

            <FormSelect
              name="timeSlotId"
              label={t("timeSlot")}
              options={timeSlotOptions}
              disabled={loading}
            />

            <div className={FORM_ACTION_ROW_CLASS_NAME}>
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
