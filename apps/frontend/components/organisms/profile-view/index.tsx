"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProfileFormMobile } from "@/components/molecules/profile-form/profile-form-mobile";
import {
  RenderDesktopOnly,
  RenderTabletBelow,
} from "@/components/molecules/responsive";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";
import { ProfileTabs } from "./profile-tabs";

export const ProfileView = () => {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();

  const mobileProps = {
    user,
    updateProfile,
    uploadAvatar,
    isLoading: isUpdating,
    isUploading,
  };

  return (
    <AppContainer>
      <RenderDesktopOnly>
        <div className="space-y-12">
          <ProfileTabs />
          <DiscoveryCarouselSection />
        </div>
      </RenderDesktopOnly>

      <RenderTabletBelow>
        <ProfileFormMobile {...mobileProps} />
      </RenderTabletBelow>
    </AppContainer>
  );
};
