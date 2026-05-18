import React from "react";
import { ProfileBankView } from "@/components/organisms/profile-bank-view";

export const metadata = {
  title: "Bank Accounts - Antigravity",
  description: "Manage your bank accounts for withdrawals.",
};

export default function BankAccountPage() {
  return <ProfileBankView />;
}
