"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProfileFormDesktop } from "@/components/molecules/profile-form/profile-form-desktop";
import { ProfileFormMobile } from "@/components/molecules/profile-form/profile-form-mobile";
import {
  RenderMobileOnly,
  RenderTabletAndAbove,
} from "@/components/molecules/responsive";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";

export const ProfileView = () => {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();

  const formProps = {
    user,
    updateProfile,
    uploadAvatar,
    isLoading: isUpdating,
    isUploading,
  };

  return (
    <AppContainer>
      <RenderTabletAndAbove>
        <div className="space-y-12">
          <ProfileFormDesktop {...formProps} />
          <DiscoveryCarouselSection />
        </div>
      </RenderTabletAndAbove>

      <RenderMobileOnly>
        <ProfileFormMobile {...formProps} />
      </RenderMobileOnly>
    </AppContainer>
  );
};
