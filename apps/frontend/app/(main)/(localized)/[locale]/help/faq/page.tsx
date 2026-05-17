import type { Metadata } from "next";
import HelpFAQView from "@/components/organisms/help-faq-view";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions.",
};

export default function FAQPage() {
  return <HelpFAQView />;
}
