import { type Metadata } from "next";

import { SettingsView } from "@/components/organisms/settings-view";

export const metadata: Metadata = {
  title: "Settings",
};

/**
 * Entry point for the settings dashboard page.
 * Renders the SettingsView component as a Server Component page wrapper
 * to support search engine crawlers and metadata handling.
 */
export default function SettingsPage() {
  return <SettingsView />;
}
