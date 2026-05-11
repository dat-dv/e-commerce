import { SettingsView } from "@/components/organisms/settings-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account preferences and appearance.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
