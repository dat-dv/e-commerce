import type { Metadata } from "next";
import { ProfileForm } from "@/components/molecules/profile-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your personal profile and account details with ease.",
};

export default function ProfilePage() {
  return <ProfileForm />;
}
