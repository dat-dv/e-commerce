import React from "react";
import type { Metadata } from "next";
import { HelpContactView } from "@/components/organisms/help-contact-view";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our support team.",
};

export default function ContactPage() {
  return <HelpContactView />;
}
