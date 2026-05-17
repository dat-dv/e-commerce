import type { Metadata } from "next";
import HelpView from "@/components/organisms/help-view";

export const metadata: Metadata = {
  title: "Help Center",
  description: "How can we help you today?",
};

export default function HelpPage() {
  return <HelpView />;
}
