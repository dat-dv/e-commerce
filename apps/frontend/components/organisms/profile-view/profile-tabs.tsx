"use client";

import type { Key } from "@/components/atoms/tabs";
import { Tab, TabList, TabPanel, Tabs } from "@/components/atoms/tabs";
import { ProfileFormDesktop } from "@/components/molecules/profile-form/profile-form-desktop";
import { AddressesView } from "@/components/organisms/addresses-view";
import { PasswordView } from "@/components/organisms/password-view";
import ProfileBankView from "@/components/organisms/profile-bank-view";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ProfileTabs() {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();
  const t = useTranslations("ProfileLayout.sidebar.links");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("tab") ?? "profile") as Key;

  const handleTabChange = (key: Key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", String(key));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const formProps = {
    user,
    updateProfile,
    uploadAvatar,
    isLoading: isUpdating,
    isUploading,
  };

  return (
    <Tabs selectedKey={activeTab} onSelectionChange={handleTabChange}>
      <TabList aria-label="Profile settings">
        <Tab id="profile">{t("profile")}</Tab>
        <Tab id="addresses">{t("addresses")}</Tab>
        <Tab id="bank">{t("bankAccount")}</Tab>
        <Tab id="password">{t("changePassword")}</Tab>
      </TabList>
      <TabPanel id="profile">
        <div className="pt-6">
          <ProfileFormDesktop {...formProps} />
        </div>
      </TabPanel>
      <TabPanel id="addresses">
        <div className="pt-6">
          <AddressesView />
        </div>
      </TabPanel>
      <TabPanel id="bank">
        <div className="pt-6">
          <ProfileBankView />
        </div>
      </TabPanel>
      <TabPanel id="password">
        <div className="pt-6">
          <PasswordView />
        </div>
      </TabPanel>
    </Tabs>
  );
}
