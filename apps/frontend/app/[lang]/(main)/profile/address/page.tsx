import React from "react";
import { AddressesView } from "@/components/organisms/addresses-view";

export const metadata = {
  title: "My Addresses - Antigravity",
  description: "Manage your shipping addresses.",
};

export default function AddressesPage() {
  return <AddressesView />;
}
