import type { Metadata } from "next";
import TermsView from "@/components/organisms/terms-view";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return <TermsView />;
}
