"use client";

import AppContainer from "@/components/atoms/app-container";
import { Tab, TabList, TabPanel, Tabs } from "@/components/atoms/tabs";
import { useAdminFlashSales } from "@/hooks/flash-sales/use-admin-flash-sales";
import { CalendarClock, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { AdminFlashSalesHeader } from "./admin-flash-sales-header";
import { AttachProductsModal } from "./attach-products-modal";
import { CampaignFormModal } from "./campaign-form-modal";
import { CampaignsTable } from "./campaigns-table";
import { TimeSlotFormModal } from "./time-slot-form-modal";
import { TimeSlotsTable } from "./time-slots-table";

export function AdminFlashSalesView() {
  const t = useTranslations("AdminFlashSalesPage.tabs");
  const {
    flashSales,
    timeSlots,
    loading,
    hasError,
    refresh,
    createTimeSlot,
    createFlashSale,
    addProductsToFlashSale,
  } = useAdminFlashSales();
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [selectedCampaignIdForAttach, setSelectedCampaignIdForAttach] =
    useState<string | undefined>(undefined);

  return (
    <main className="bg-surface text-content relative min-h-screen overflow-x-hidden py-8">
      <AppContainer size="2xl" className="flex flex-col gap-8">
        <AdminFlashSalesHeader loading={loading} onRefresh={refresh} />

        <Tabs defaultSelectedKey="campaigns" className="gap-6">
          <TabList aria-label={t("campaigns")}>
            <Tab id="campaigns">
              <CalendarClock aria-hidden="true" className="size-4" />
              {t("campaigns")}
            </Tab>
            <Tab id="timeSlots">
              <Clock3 aria-hidden="true" className="size-4" />
              {t("timeSlots")}
            </Tab>
          </TabList>

          <TabPanel id="campaigns" className="mt-0">
            <CampaignsTable
              flashSales={flashSales}
              loading={loading}
              hasError={hasError}
              onRetry={refresh}
              onCreate={() => setIsCampaignModalOpen(true)}
              onAttachProducts={(id) => {
                setSelectedCampaignIdForAttach(id);
                setIsAttachModalOpen(true);
              }}
            />
          </TabPanel>
          <TabPanel id="timeSlots" className="mt-0">
            <TimeSlotsTable
              timeSlots={timeSlots}
              loading={loading}
              hasError={hasError}
              onRetry={refresh}
              onCreate={() => setIsTimeSlotModalOpen(true)}
            />
          </TabPanel>
        </Tabs>

        <TimeSlotFormModal
          isOpen={isTimeSlotModalOpen}
          loading={loading}
          onClose={() => setIsTimeSlotModalOpen(false)}
          onSubmit={createTimeSlot}
        />

        <CampaignFormModal
          isOpen={isCampaignModalOpen}
          loading={loading}
          timeSlots={timeSlots}
          onClose={() => setIsCampaignModalOpen(false)}
          onSubmit={createFlashSale}
        />

        <AttachProductsModal
          isOpen={isAttachModalOpen}
          loading={loading}
          flashSales={flashSales}
          preselectedFlashSaleId={selectedCampaignIdForAttach}
          onClose={() => {
            setIsAttachModalOpen(false);
            setSelectedCampaignIdForAttach(undefined);
          }}
          onSubmit={addProductsToFlashSale}
        />
      </AppContainer>
    </main>
  );
}
