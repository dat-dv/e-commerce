"use client";

import AppContainer from "@/components/atoms/app-container";
import { Tab, TabList, TabPanel, Tabs } from "@/components/atoms/tabs";
import { useAdminFlashSales } from "@/hooks/flash-sales/use-admin-flash-sales";
import { CalendarClock, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminFlashSalesHeader } from "./admin-flash-sales-header";
import { CampaignsTable } from "./campaigns-table";
import { TimeSlotsTable } from "./time-slots-table";

export function AdminFlashSalesView() {
  const t = useTranslations("AdminFlashSalesPage.tabs");
  const { flashSales, timeSlots, loading, hasError, refresh } =
    useAdminFlashSales();

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
            />
          </TabPanel>
          <TabPanel id="timeSlots" className="mt-0">
            <TimeSlotsTable
              timeSlots={timeSlots}
              loading={loading}
              hasError={hasError}
              onRetry={refresh}
            />
          </TabPanel>
        </Tabs>
      </AppContainer>
    </main>
  );
}
